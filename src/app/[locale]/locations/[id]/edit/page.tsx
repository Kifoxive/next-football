"use client";

import ContentLayout from "@/components/ContentLayout/ContentLayout";
import { config } from "@/config";
import { useDocumentTitle } from "@/hooks";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import DeleteIcon from "@mui/icons-material/Delete";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import toast from "react-hot-toast";
import { useEffect, useState, useTransition } from "react";
import { Box, CircularProgress } from "@mui/material";
import { axiosClient } from "@/utils/axiosClient";
import { GetOneLocation, ILocationForm } from "../../types";
import { LocationForm } from "../../_components/LocationForm";
import Dialog from "@/components/Dialog/Dialog";
import { IPictureItem } from "@/components/AddPictures/AddPictures";

export default function LocationsEditPage() {
  const t = useTranslations("locations.edit");
  useDocumentTitle(t("title"));

  const { id }: { id: string } = useParams();
  const router = useRouter();
  const [isUpdatePending, startUpdateTransition] = useTransition();
  const [isRemovePending, startRemoveTransition] = useTransition();
  const [isRemoveConfirmationDialogOpen, setIsRemoveConfirmationDialogOpen] =
    useState<boolean>(false);
  const [location, setLocation] = useState<GetOneLocation["response"]>();

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const { data } = await axiosClient.get<GetOneLocation["response"]>(
          config.endpoints.locations.edit.replace(":id", id)
        );

        setLocation(data);
      } catch (e) {
        toast.error(t("fetchError"));
        console.error(e);
      }
    };
    fetchLocation();
  }, [id]);

  const onSubmit = async (
    newLocationData: ILocationForm,
    attachedPictures: IPictureItem[]
  ) => {
    const formData = new FormData();
    formData.append("location", JSON.stringify(newLocationData));

    attachedPictures.forEach((pic, index) => {
      if (pic.file) {
        formData.append(`file_${index}`, pic.file);
      } else {
        // existed image - send ID
        formData.append(`existing_${index}`, pic.originalId!);
      }
    });

    startUpdateTransition(async () => {
      try {
        await axiosClient.put(
          config.endpoints.locations.edit.replace(":id", id),
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        toast.success(t("updateSuccess"));
        router.push(config.routes.locations.list);
      } catch (e) {
        console.error(e);
        toast.error(t("updateError"));
      }
    });
  };

  const onRemove = async () => {
    startRemoveTransition(async () => {
      try {
        await axiosClient.delete(
          config.endpoints.locations.delete.replace(":id", id)
        );
        toast.success(t("removeSuccess"));
        router.push(config.routes.locations.list);
      } catch {
        toast.error(t("removeError"));
      }
    });
  };

  return (
    <ContentLayout
      title={t("title")}
      isLoading={!location}
      endContent={[
        {
          text: t("removeButton"),
          icon: <DeleteIcon />,
          variant: "outlined",
          color: "error",
          loading: isRemovePending,
          onClick: () => setIsRemoveConfirmationDialogOpen(true),
        },
        {
          text: t("updateButton"),
          icon: <UpgradeIcon />,
          variant: "contained",
          color: "success",
          type: "submit",
          form: "location_form",
          loading: isUpdatePending,
        },
      ]}
    >
      {location ? (
        <LocationForm
          fetchedData={location}
          onSubmitData={onSubmit}
          isLoading={isUpdatePending}
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
