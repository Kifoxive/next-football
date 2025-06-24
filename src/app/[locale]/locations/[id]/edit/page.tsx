"use client";

import ContentLayout from "@/components/ContentLayout";
import { config } from "@/config";
import { useDocumentTitle } from "@/hooks";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import DeleteIcon from "@mui/icons-material/Delete";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { axiosClient } from "@/utils/axiosClient";
import { GetOneLocation, ILocation, ILocationForm } from "../../types";
import { LocationForm } from "../../_components/LocationForm";
import Dialog from "@/components/Dialog";
import { IPictureItem } from "@/components/AddPictures";

export default function LocationsEditPage() {
  const t = useTranslations("locations.edit");
  useDocumentTitle(t("title"));

  const { id } = useParams();

  // const authUser = useAuthStore((s) => s.user);
  const [location, setLocation] = useState<ILocation>();
  const router = useRouter();
  const [isUpdateLoading, setIsUpdateLoading] = useState<boolean>(false);
  const [isRemoveLoading, setIsRemoveLoading] = useState<boolean>(false);
  const [isRemoveConfirmationDialogOpen, setIsRemoveConfirmationDialogOpen] =
    useState<boolean>(false);

  useEffect(() => {
    if (typeof id !== "string") return;

    const fetchLocation = async () => {
      try {
        const { data } = await axiosClient.get<GetOneLocation["response"]>(
          config.endpoints.locations.edit.replace(":id", id)
        );

        setLocation(data);
      } catch (e) {
        console.error(e);
      } finally {
      }
    };
    fetchLocation();
  }, [id]);

  const onSubmit = async (
    newLocationData: ILocationForm,
    attachedPictures: IPictureItem[]
  ) => {
    setIsUpdateLoading(true);

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

    try {
      await axiosClient.put(`${config.endpoints.locations}/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(t("updateSuccess"));
      router.push(config.routes.locations.list);
    } catch (e) {
      console.error(e);
      toast.error(t("updateError"));
    } finally {
      setIsUpdateLoading(false);
    }
  };

  const onRemove = async () => {
    setIsRemoveLoading(true);
    try {
      await axiosClient.delete(`${config.endpoints.locations}/${id}`);
      toast.success(t("removeSuccess"));
      router.push(config.routes.locations.list);
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
        // authUser &&
        // permissions.moderator.includes(authUser.role) &&
        [
          {
            text: t("removeButton"),
            icon: <DeleteIcon />,
            variant: "outlined",
            color: "error",
            loading: isRemoveLoading,
            onClick: () => setIsRemoveConfirmationDialogOpen(true),
          },
          {
            text: t("updateButton"),
            icon: <UpgradeIcon />,
            variant: "contained",
            color: "success",
            type: "submit",
            form: "location_form",
            loading: isUpdateLoading,
          },
        ]
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
