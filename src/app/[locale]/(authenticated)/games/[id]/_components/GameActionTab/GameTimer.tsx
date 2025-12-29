import { Typography } from "@mui/material";
import { useEffect, useState } from "react";

type GameTimerProps = {
  isGameLive: boolean;
  started_at: string | null;
  ended_at: string | null;
};

export default function GameTimer({
  isGameLive,
  started_at,
  ended_at,
}: GameTimerProps) {
  // Game control states
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Update timer when game state changes
  useEffect(() => {
    if (isGameLive) {
      setIsTimerRunning(true);
    } else {
      setIsTimerRunning(false);
    }
  }, [isGameLive]);

  // Calculate elapsed time from started_at
  const getElapsedSeconds = (): number => {
    if (!started_at) return 0;
    const startTime = new Date(started_at).getTime();

    // If game has ended, use ended_at timestamp for fixed time
    if (ended_at) {
      const endTime = new Date(ended_at).getTime();
      return Math.floor((endTime - startTime) / 1000);
    }

    // Otherwise use current time
    const currentTime = new Date().getTime();
    return Math.floor((currentTime - startTime) / 1000);
  };

  const [elapsedSeconds, setElapsedSeconds] = useState(getElapsedSeconds());

  // Format time as HH:MM:SS

  // Timer effect - calculate from started_at
  useEffect(() => {
    let interval: NodeJS.Timeout;

    // Only update timer if game is live and hasn't ended
    if (isGameLive && started_at && !ended_at) {
      // Update timer every second based on started_at timestamp
      interval = setInterval(() => {
        setElapsedSeconds(getElapsedSeconds());
      }, 1000);
    } else if (ended_at && started_at) {
      // If game has ended, set fixed time once
      setElapsedSeconds(getElapsedSeconds());
    }

    return () => clearInterval(interval);
  }, [isGameLive, started_at]);

  // Calculate time components from elapsed seconds
  const currentTimeHours = Math.floor(elapsedSeconds / 3600);
  const currentTimeMinutes = Math.floor((elapsedSeconds % 3600) / 60);
  const currentTimeSeconds = elapsedSeconds % 60;

  return (
    <Typography
      variant="h3"
      sx={{
        fontFamily: "monospace",
        fontWeight: "bold",
        color: isTimerRunning ? "success.main" : "text.secondary",
      }}
    >
      {currentTimeHours > 0
        ? `${String(currentTimeHours).padStart(2, "0")}:${String(
            currentTimeMinutes
          ).padStart(2, "0")}:${String(currentTimeSeconds).padStart(2, "0")}`
        : `${String(currentTimeMinutes).padStart(2, "0")}:${String(
            currentTimeSeconds
          ).padStart(2, "0")}`}
    </Typography>
  );
}
