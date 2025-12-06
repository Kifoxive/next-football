import { Alert, AlertTitle } from "@mui/material";

// type InfoProps = {};

export const Info: React.FC = () => {
  return (
    <Alert severity="info" variant="outlined" sx={{ mt: 2 }}>
      <AlertTitle>Moderator rights</AlertTitle>
      All moderators and admins already have rights to note that a goal was
      scored. You only need to assign game moderators if you want to give
      limited rights to a player (e.g. injured player helping track stats).
    </Alert>
  );
};
