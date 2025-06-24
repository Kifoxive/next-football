"use client";

import ContentLayout from "@/components/ContentLayout";
import { config } from "@/config";
import { useDocumentTitle } from "@/hooks";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import toast from "react-hot-toast";
import { useState } from "react";
import { LocationForm } from "../_components/LocationForm";
import { ILocationForm } from "../types";
import { axiosClient } from "@/utils/axiosClient";
import { IPictureItem } from "@/components/AddPictures";

export default function LocationsNewPage() {
  const t = useTranslations("locations.new");
  useDocumentTitle(t("title"));

  const router = useRouter();
  const [isCreateLoading, setIsCreateLoading] = useState<boolean>(false);

  const onSubmit = async (
    newLocationData: ILocationForm,
    attachedPictures: IPictureItem[]
  ) => {
    setIsCreateLoading(true);

    const formData = new FormData();
    formData.append("location", JSON.stringify(newLocationData));
    attachedPictures.forEach((pic, index) => {
      if (pic.file) formData.append(`file_${index}`, pic.file);
    });

    try {
      await axiosClient.post(config.endpoints.locations.new, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(t("createSuccess"));
      router.push(config.routes.locations.list);
    } catch {
      toast.error(t("createError"));
    } finally {
      setIsCreateLoading(false);
    }
  };

  return (
    <ContentLayout
      title={t("title")}
      endContent={[
        {
          text: t("addButton"),
          icon: <UpgradeIcon />,
          variant: "contained",
          color: "success",
          type: "submit",
          form: "location_form",
          loading: isCreateLoading,
        },
      ]}
    >
      <LocationForm onSubmitData={onSubmit} isLoading={isCreateLoading} />
    </ContentLayout>
  );
}
