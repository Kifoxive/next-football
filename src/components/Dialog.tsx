import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import MuiDialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { Divider } from "@mui/material";

const BootstrapDialog = styled(MuiDialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

type DialogProps = {
  isOpen: boolean;
  title: string;
  description: string;
  agreeBtnText: string;
  cancelBtnText: string;
  setIsOpen: (open: boolean) => void;
  onAgree: () => void;
  onCancel: () => void;
};

const Dialog: React.FC<DialogProps> = ({
  isOpen,
  title,
  description,
  agreeBtnText,
  cancelBtnText,
  setIsOpen,
  onAgree,
  onCancel,
}) => {
  return (
    <BootstrapDialog
      onClose={() => setIsOpen(false)}
      aria-labelledby="customized-dialog-title"
      open={isOpen}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        {title}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={() => setIsOpen(false)}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <Divider />
      <DialogContent>
        <Typography gutterBottom>{description}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} variant="outlined">
          {cancelBtnText}
        </Button>
        <Button autoFocus onClick={onAgree} variant="contained">
          {agreeBtnText}
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
};
export default Dialog;
