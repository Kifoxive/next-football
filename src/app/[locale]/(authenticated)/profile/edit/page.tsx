"use client";

import ContentLayout from "@/components/ContentLayout/ContentLayout";

import { useTranslations } from "next-intl";
import { ProfileForm } from "./_components/ProfileForm";
import { useEffect, useState, useTransition } from "react";
import { useDocumentTitle } from "@/hooks";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import { GetOneUser } from "../../players/types";
import { axiosClient } from "@/utils/axiosClient";
import { config } from "@/config";
import toast from "react-hot-toast";
import { IProfileForm } from "../types";
import { IPictureItem } from "@/components/AddPictures";

export default function ProfileEditPage() {
  const t = useTranslations();
  useDocumentTitle(t("profile.edit.title"));

  const [isUpdatePending, startUpdateTransition] = useTransition();

  const [player, setPlayer] = useState<GetOneUser["response"]>();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axiosClient.get(config.endpoints.auth.me);

        setPlayer(data);
      } catch (e) {
        toast.error(t("profile.edit.fetchError"));
        console.log(e);
      }
    };
    fetchProfile();
  }, []);

  const onSubmit = (newProfileData: IProfileForm, avatar?: IPictureItem) => {
    if (!player) return;
    startUpdateTransition(() => {
      const formData = new FormData();
      formData.append("player", JSON.stringify(newProfileData));
      if (avatar?.file) formData.append("avatar", avatar.file);

      toast.promise(
        axiosClient.put(
          config.endpoints.players.edit.replace(":id", player.id),
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        ),
        {
          loading: t("profile.edit.updateLoading"),
          success: t("profile.edit.updateSuccess"),
          error: t("profile.edit.updateError"),
        }
      );
    });
  };

  return (
    <ContentLayout
      title={t("profile.edit.title")}
      isLoading={!player}
      endContent={[
        {
          text: t("profile.edit.updateButton"),
          icon: <UpgradeIcon />,
          variant: "contained",
          color: "success",
          type: "submit",
          form: "profile_form",
          loading: isUpdatePending,
        },
      ]}
    >
      {player && <ProfileForm fetchedData={player} onSubmitData={onSubmit} />}
    </ContentLayout>
  );
}
