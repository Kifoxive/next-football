import { useTransition, useState } from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import MuiDialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { Box, Divider } from "@mui/material";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { axiosClient } from "@/utils/axiosClient";
import { config } from "@/config";
import { QRCodeSVG } from "qrcode.react";
import { CopyCell } from "../CopyCell";

const BootstrapDialog = styled(MuiDialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

type InviteDialogProps = {
  userId: string;
  inviterId: string;
  isOpen: boolean;
  // title: string;
  // description?: string;
  // agreeBtnText: string;
  // cancelBtnText: string;
  setIsOpen: (open: boolean) => void;
  // onAgree: () => void;
  onCancel: () => void;
};

const InviteDialog: React.FC<InviteDialogProps> = ({
  userId,
  inviterId,
  isOpen,
  // title,
  // description,
  // agreeBtnText,
  // cancelBtnText,
  setIsOpen,
  // onAgree,
  onCancel,
}) => {
  const t = useTranslations("players.edit.inviteDialog");

  const [isGeneratePending, startGenerateTransition] = useTransition();
  const [activationLink, setActivationLink] = useState<string>();

  const onGenerate = () => {
    startGenerateTransition(() => {
      toast.promise(
        axiosClient
          .post(config.endpoints.auth.generateActivationLink, {
            userId,
            inviterId,
          })
          .then(({ data: { url } }) => {
            setActivationLink(url);
          }),
        {
          loading: t("createLoading"),
          success: t("createSuccess"),
          error: t("createError"),
        }
      );
    });
  };

  return (
    <BootstrapDialog
      onClose={() => setIsOpen(false)}
      aria-labelledby="customized-dialog-title"
      open={isOpen}
      className="overflow-hidden"
    >
      <DialogTitle
        sx={{ m: 0, p: 2 }}
        id="customized-dialog-title"
        fontSize="medium"
        variant="h5"
      >
        {t("title")}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={() => setIsOpen(false)}
        sx={(theme) => ({
          position: "absolute",
          right: 0,
          top: 0,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <Divider />
      <DialogContent>
        <Typography gutterBottom>{t("description")}</Typography>
        {activationLink && (
          <Box className="flex flex-col items-center w-full py-2">
            <QRCodeSVG
              value={activationLink}
              imageSettings={{
                src: "/favicon/logo.svg",
                height: 25,
                width: 25,
                excavate: true,
              }}
              marginSize={1}
            />
            <CopyCell text={activationLink} />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} variant="outlined" size="small">
          {t("cancelBtnText")}
        </Button>
        <Button
          loading={isGeneratePending}
          disabled={isGeneratePending || !!activationLink}
          onClick={onGenerate}
          variant="contained"
          size="small"
        >
          {t("agreeBtnText")}
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
};
export default InviteDialog;
