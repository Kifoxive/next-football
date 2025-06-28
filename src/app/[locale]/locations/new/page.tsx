"use client";

import ContentLayout from "@/components/ContentLayout/ContentLayout";
import { config } from "@/config";
import { useDocumentTitle } from "@/hooks";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import toast from "react-hot-toast";
import { useTransition } from "react";
import { LocationForm } from "../_components/LocationForm";
import { ILocationForm, PostLocation } from "../types";
import { axiosClient } from "@/utils/axiosClient";
import { IPictureItem } from "@/components/AddPictures/AddPictures";

export default function LocationsNewPage() {
  const t = useTranslations("locations.new");
  useDocumentTitle(t("title"));

  const router = useRouter();
  const [isCreatePending, startCreateTransition] = useTransition();

  const onSubmit = (
    newLocationData: ILocationForm,
    attachedPictures: IPictureItem[]
  ) => {
    startCreateTransition(async () => {
      const formData = new FormData();
      formData.append("location", JSON.stringify(newLocationData));
      attachedPictures.forEach((pic, index) => {
        if (pic.file) formData.append(`file_${index}`, pic.file);
      });

      try {
        await axiosClient.post<PostLocation["response"]>(
          config.endpoints.locations.new,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success(t("createSuccess"));
        router.push(config.routes.locations.list);
      } catch (e) {
        toast.error(t("createError"));
        console.error(e);
      }
    });
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
          loading: isCreatePending,
        },
      ]}
    >
      <LocationForm onSubmitData={onSubmit} />
    </ContentLayout>
  );
}
