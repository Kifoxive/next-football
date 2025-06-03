"use client";

import ContentLayout from "@/components/ContentLayout";
import { config } from "@/config";
import { useDocumentTitle } from "@/hooks";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import toast from "react-hot-toast";

import { useState } from "react";
import { LocationForm } from "../LocationForm";
import { ILocationForm } from "../types";
import { Button } from "@mui/material";
import { axiosClient } from "@/utils/axiosClient";

export default function LocationsNewpage() {
  const t = useTranslations("locations.new");
  useDocumentTitle(t("title"));

  const router = useRouter();
  const [isCreateLoading, setIsCreateLoading] = useState<boolean>(false);

  const onSubmit = async (
    newLocationData: ILocationForm,
    attachedPictures: File[]
  ) => {
    setIsCreateLoading(true);

    const formData = new FormData();
    formData.append("location", JSON.stringify(newLocationData));
    attachedPictures.forEach((file, index) => {
      formData.append(`file_${index}`, file);
    });

    try {
      await axiosClient.post(config.endpoints.locations, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(t("createSuccess"));
      router.push(config.routes.locations.table);
    } catch {
      toast.error(t("createError"));
    } finally {
      setIsCreateLoading(false);
    }
  };

  return (
    <ContentLayout
      title={t("title")}
      endContent={
        <Button
          form="location_form"
          type="submit"
          variant="contained"
          color="success"
          loading={isCreateLoading}
        >
          {t("addButton")}
        </Button>
      }
    >
      <LocationForm onSubmitData={onSubmit} isLoading={isCreateLoading} />
    </ContentLayout>
  );
}
