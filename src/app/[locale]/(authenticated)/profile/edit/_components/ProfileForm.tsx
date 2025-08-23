"use client";

import { Box, Button, Container, IconButton, Paper } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useTranslations } from "next-intl";
import { FormProvider, useForm } from "react-hook-form";
import { TextField } from "@/components/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MarkdownEditor } from "@/components/form/components/MarkdownEditor/MarkdownEditor";
import { IUser } from "../../../players/types";
import { IProfileForm, profileFormSchema } from "../../types";
import Image from "next/image";
import { useEffect, useRef, useState, useTransition } from "react";
import Dialog from "@/components/Dialog/Dialog";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { config } from "@/config";
import { IPictureItem } from "@/components/AddPictures";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";

const fallbackImage = "/images/showcase-missing-avatar.webp";

type ProfileFormProps = {
  fetchedData: IUser;
  onSubmitData: (data: IProfileForm, avatar?: IPictureItem) => void;
};

export const ProfileForm: React.FC<ProfileFormProps> = ({
  fetchedData,
  onSubmitData,
}) => {
  const t = useTranslations();
  const [avatar, setAvatar] = useState<IPictureItem>();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const supabase = createClient();
  const [isLogoutPending, startLogoutTransition] = useTransition();
  const [isLogoutConfirmationDialogOpen, setIsLogoutConfirmationDialogOpen] =
    useState<boolean>(false);

  const methods = useForm<IProfileForm>({
    defaultValues: fetchedData,
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(profileFormSchema(t)),
  });
  const { handleSubmit } = methods;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files !== null) {
      if (e.target.files[0].size > 5242880) {
        e.target.value = "";
        return toast.error(t("basic.size_too_big", { value: 5 }));
      }

      const objectUrl = URL.createObjectURL(e.target.files[0]);
      // if (objectUrl) URL.revokeObjectURL(objectUrl);
      setAvatar({
        url: objectUrl,
        file: e.target.files[0],
      });
      e.target.value = "";
    }
  };

  const onSubmit = async (formData: IProfileForm) => {
    onSubmitData(formData, avatar);
  };

  const onLogout = () => {
    startLogoutTransition(() => {
      toast.promise(
        supabase.auth.signOut().then(() => router.push(config.routes.login)),
        {
          loading: t("logout.loading"),
          success: t("logout.success"),
          error: t("logout.error"),
        }
      );
    });
  };

  // on first render, add supabase avatar picture to local state
  useEffect(() => {
    if (!fetchedData.avatar_url) return;

    const avatar_url = fetchedData.avatar_url;

    const fetchImages = async () => {
      const { data, error } = await supabase.storage
        .from(config.buckets.profiles)
        .createSignedUrl(avatar_url, 3600);

      if (error || !data) {
        console.error("Error fetching signed URL", error);
        return null;
      }

      setAvatar({
        file: null,
        url: data.signedUrl,
        originalId: avatar_url,
      });
    };

    fetchImages();
  }, []);

  return (
    <FormProvider {...methods}>
      <form
        id="profile_form"
        onSubmit={handleSubmit(onSubmit, (error) => console.log(error))}
      >
        <Container maxWidth="md" disableGutters>
          <Box className="flex flex-col items-center gap-8">
            <Box
              component={Paper}
              className="relative w-[100px] md:w-[200px] aspect-[1/1] rounded-full! overflow-hidden"
            >
              <Image
                src={avatar?.url || fallbackImage}
                fill
                alt={fetchedData.user_name}
                // priority
                className="object-cover"
              />
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              <Box className="absolute left-0 top-0 right-0 bottom-0 opacity-0 hover:opacity-100 bg-gray-800/50 flex justify-center items-center">
                <Box className="hidden md:block">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outlined"
                    size="small"
                  >
                    {t("profile.edit.uploadAvatar")}
                  </Button>
                </Box>
                <Box className="md:hidden">
                  <IconButton onClick={() => fileInputRef.current?.click()}>
                    <InsertPhotoIcon color="primary" />
                  </IconButton>
                </Box>
              </Box>
            </Box>
            <Grid container spacing={2} columns={{ xs: 1, sm: 3 }}>
              <Grid size={1}>
                <TextField
                  name="user_name"
                  label={t("players.form.user_name")}
                  fullWidth
                />
              </Grid>
              <Grid size={1}>
                <TextField
                  name="first_name"
                  label={t("players.form.first_name")}
                  fullWidth
                />
              </Grid>
              <Grid size={1}>
                <TextField
                  name="last_name"
                  label={t("players.form.last_name")}
                  fullWidth
                />
              </Grid>
              <Grid size={3}>
                <MarkdownEditor
                  name="description"
                  label={t("games.form.description")}
                />
              </Grid>
              <Grid>
                <LocaleSwitcher />
              </Grid>
            </Grid>
            <Button
              onClick={() => setIsLogoutConfirmationDialogOpen(true)}
              variant="outlined"
              color="error"
              size="small"
              loading={isLogoutPending}
              disabled={isLogoutPending}
            >
              {t("logout.logoutButton")}
            </Button>
          </Box>
        </Container>
      </form>
      <Dialog
        isOpen={isLogoutConfirmationDialogOpen}
        title={t("logout.logoutDialog.title")}
        agreeBtnText={t("logout.logoutDialog.agreeBtnText")}
        cancelBtnText={t("logout.logoutDialog.cancelBtnText")}
        onAgree={onLogout}
        onCancel={() => setIsLogoutConfirmationDialogOpen(false)}
        setIsOpen={setIsLogoutConfirmationDialogOpen}
      />
    </FormProvider>
  );
};
