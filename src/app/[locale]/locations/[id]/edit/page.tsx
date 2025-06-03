"use client";

import ContentLayout from "@/components/ContentLayout";
import { config, permissions } from "@/config";
import { useDocumentTitle } from "@/hooks";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";

import toast from "react-hot-toast";

import { useEffect, useState } from "react";

import { Box, Button, CircularProgress } from "@mui/material";
import { axiosClient } from "@/utils/axiosClient";
import { ILocation, ILocationForm } from "../../types";
import { LocationForm } from "../../LocationForm";
import { useAuthStore } from "@/store/auth";
import Dialog from "@/components/Dialog";
import { createClient } from "@/utils/supabase/client";

export default function LocationsNewpage() {
  const t = useTranslations("locations.edit");
  useDocumentTitle(t("title"));

  const { id } = useParams();
  const supabase = createClient();
  const authUser = useAuthStore((s) => s.user);
  const [location, setLocation] = useState<ILocation>();
  const router = useRouter();
  const [isUpdateLoading, setIsUpdateLoading] = useState<boolean>(false);
  const [isRemoveLoading, setIsRemoveLoading] = useState<boolean>(false);
  const [isRemoveConfirmationDialogOpen, setIsRemoveConfirmationDialogOpen] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .eq("id", id)
        .single();
      if (error) return toast.error(t("fetchError"));
      setLocation(data);
    };
    fetchUser();
  }, [id]);

  const onSubmit = async (
    newLocationData: ILocationForm,
    attachedPictures: File[]
  ) => {
    setIsUpdateLoading(true);

    const formData = new FormData();
    formData.append("location", JSON.stringify(newLocationData));
    attachedPictures.forEach((file, index) => {
      formData.append(`file_${index}`, file);
    });

    try {
      await axiosClient.patch(config.endpoints.locations, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(t("createSuccess"));
      router.push(config.routes.locations.table);
    } catch {
      toast.error(t("createError"));
    } finally {
      setIsUpdateLoading(false);
    }
  };

  const onRemove = async () => {
    setIsRemoveLoading(true);
    try {
      await axiosClient.delete(`${config.endpoints.players}/${id}`);
      toast.success(t("removeSuccess"));
      router.push(config.routes.players.table);
    } catch {
      toast.error(t("removeError"));
    } finally {
      setIsRemoveLoading(false);
    }
  };

  return (
    <ContentLayout
      title={t("title")}
      endContent={
        authUser &&
        permissions.moderator.includes(authUser.role) && (
          <>
            <Button
              onClick={() => setIsRemoveConfirmationDialogOpen(true)}
              variant="outlined"
              color="error"
              loading={isRemoveLoading}
            >
              {t("removeButton")}
            </Button>
            <Button
              form="location_form"
              type="submit"
              variant="contained"
              color="success"
              loading={isUpdateLoading}
            >
              {t("updateButton")}
            </Button>
          </>
        )
      }
    >
      {location ? (
        <LocationForm
          fetchedData={location}
          onSubmitData={onSubmit}
          isLoading={isUpdateLoading}
        />
      ) : (
        <Box className="flex justify-center items-center flex-1 mb-[10%]">
          <CircularProgress color="inherit" />
        </Box>
      )}
      <Dialog
        isOpen={isRemoveConfirmationDialogOpen}
        title={t("removeDialog.title")}
        description={t("removeDialog.description")}
        agreeBtnText={t("removeDialog.agreeBtnText")}
        cancelBtnText={t("removeDialog.cancelBtnText")}
        onAgree={onRemove}
        onCancel={() => setIsRemoveConfirmationDialogOpen(false)}
        setIsOpen={setIsRemoveConfirmationDialogOpen}
      />
    </ContentLayout>
  );
}
