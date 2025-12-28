/**
 * Frontend utility for interacting with the Game State Machine API
 *
 * Usage example:
 *
 * const { executeCommand, isLoading, error } = useGameCommand(gameId);
 *
 * // Start the game
 * await executeCommand('startGame');
 *
 * // Record a goal
 * await executeCommand('recordMove', {
 *   scorer_id: 'player-123',
 *   is_scorer_goalkeeper: false,
 *   assist_id: 'player-456',
 *   is_assist_goalkeeper: false,
 *   time: 45,
 *   type: 'regular_goal',
 *   assist_type: 'regular_play'
 * });
 *
 * // Pause the game
 * await executeCommand('pauseGame');
 */

import { IGame } from "@/app/[locale]/(authenticated)/games/types";
import { useState } from "react";

export async function executeGameCommand(
  gameId: string,
  command: string,
  payload?: Record<string, unknown>
): Promise<{ success: boolean; game?: IGame; error?: string }> {
  const response = await fetch(`/api/games/${gameId}/commands`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      command,
      payload,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Command execution failed");
  }

  return {
    success: true,
    game: data.game,
  };
}

// Optional React Hook for easier usage
export function useGameCommand(gameId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeCommand = async (
    command: string,
    payload?: Record<string, unknown>
  ) => {
    setIsLoading(true);
    setError(null);

    const result = await executeGameCommand(gameId, command, payload);

    if (!result.success) {
      setError(result.error || "Command failed");
    }

    setIsLoading(false);
    return result;
  };

  return {
    executeCommand,
    isLoading,
    error,
  };
}
