"use client";

import { Box, Button, Container } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useTranslations } from "next-intl";
import { FormProvider, useForm } from "react-hook-form";

import { SelectField, TextField } from "@/components/form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ILocationForm,
  ILocation,
  locationFormSchema,
} from "@/app/[locale]/locations/types";
import { useEffect, useState } from "react";
import { AddPictures, PictureItem } from "@/components/AddPictures";
import { BUILDING_TYPE_ENUM, config, FLOOR_TYPE_ENUM } from "@/config";
import { createClient } from "@/utils/supabase/client";

type LocationFormProps = {
  fetchedData?: ILocation;
  isLoading: boolean;
  onSubmitData: (data: ILocationForm, attachedPictures: File[]) => void;
};

export const LocationForm: React.FC<LocationFormProps> = ({
  fetchedData,
  onSubmitData,
}) => {
  const t = useTranslations();
  const supabase = createClient();
  const [attachedPictures, setAttachedPictures] = useState<File[]>([]);
  const isNew = !fetchedData;

  const formDefaultValues = {
    name: "",
    description: "",
    address: "",
    price_per_hour: 0,
    floor_type: "",
    building_type: "",
    latitude: 0,
    longitude: 0,
    image_list: [],
  };

  const methods = useForm<ILocationForm>({
    defaultValues: fetchedData || formDefaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(locationFormSchema(t)),
  });
  const { handleSubmit, getValues } = methods;

  const floorTypeOptions = Object.values(FLOOR_TYPE_ENUM).map((value) => ({
    label: t(`locations.floor_type.${value}`),
    value,
  }));

  const buildingTypeOptions = Object.values(BUILDING_TYPE_ENUM).map(
    (value) => ({
      label: t(`locations.building_type.${value}`),
      value,
    })
  );

  const onSubmit = async (formData: ILocationForm) => {
    onSubmitData(formData, attachedPictures);
  };

  // pictures state to manipulate then locally
  const [pictures, setPictures] = useState<PictureItem[]>([]);

  // on first render, add supabase pictures to local state
  useEffect(() => {
    if (!fetchedData) return;

    const fetchImages = async () => {
      const signedUrls = await Promise.all(
        fetchedData.image_list.map(async (image_id) => {
          const { data, error } = await supabase.storage
            .from(config.buckets.locations)
            .createSignedUrl(image_id, 3600);

          if (error || !data) {
            console.error("Error fetching signed URL", error);
            return null;
          }

          return {
            file: null,
            url: data.signedUrl,
            originalId: image_id,
          };
        })
      );

      // filter null (in case of errors)
      setPictures(signedUrls.filter(Boolean) as PictureItem[]);
    };

    fetchImages();
  }, [fetchedData]);

  const handleAddPicture = (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    setPictures((prev) => [...prev, { file, url: objectUrl }]);
  };

  const handleRemovePicture = (index: number) => {
    setPictures((prev) => {
      const newArr = [...prev];
      const removed = newArr.splice(index, 1)[0];

      if (removed.file) {
        // if this is a local object URL — free the memory
        URL.revokeObjectURL(removed.url);
      }

      return newArr;
    });
  };

  return (
    <FormProvider {...methods}>
      <form
        id="location_form"
        onSubmit={handleSubmit(onSubmit, (error) => console.log(error))}
      >
        {/* <Container className="w-full" disableGutters> */}
        <Container maxWidth="md" disableGutters>
          <Grid
            container
            spacing={4}
            // columns={{ xs: 1, md: 2 }}
            columns={1}
            flexDirection="row-reverse"
          >
            {/* left side (form) */}
            <Grid
              container
              spacing={2}
              columns={{ xs: 1, sm: 2 }}
              size={1}
              className="h-fit"
            >
              <Grid size={1}>
                <TextField
                  name="name"
                  label={t("locations.form.name")}
                  fullWidth
                />
              </Grid>
              <Grid size={1}>
                <TextField
                  name="price_per_hour"
                  label={t("locations.form.price_per_hour")}
                  fullWidth
                  type="number"
                />
              </Grid>
              <Grid size={1}>
                <SelectField
                  name="floor_type"
                  label={t("locations.form.floor_type")}
                  options={floorTypeOptions}
                  fullWidth
                />
              </Grid>
              <Grid size={1}>
                <SelectField
                  name="building_type"
                  label={t("locations.form.building_type")}
                  options={buildingTypeOptions}
                  fullWidth
                />
              </Grid>
              <Grid size={2}>
                <TextField
                  name="address"
                  label={t("locations.form.address")}
                  fullWidth
                />
              </Grid>
              <Grid size={2}>
                <TextField
                  name="description"
                  label={t("locations.form.description")}
                  fullWidth
                  multiline
                  rows={4}
                />
              </Grid>
            </Grid>
            {/* right side (img) */}
            <Grid size={1}>
              {/* <Box
                component={Paper}
                className="relative w-full h-full overflow-hidden aspect-2/1"
              >
                <Image
                  fill
                  className="object-cover"
                  src={
                    (imgFile && URL.createObjectURL(imgFile)) ||
                    fetchedData?.image_list[0] ||
                    "/images/showcase-missing-image.webp"
                  }
                  alt={fetchedData?.name || ""}
                />
                <Box className="absolute right-[10px] bottom-[10px] z-10">
                  <Button variant="contained">
                    {t("locations.upload_cover")}
                  </Button>
                </Box>
              </Box> */}
              <AddPictures
                locationName={getValues("name")}
                pictures={pictures}
                onAddPicture={handleAddPicture}
                onRemovePicture={handleRemovePicture}
                onReorderPictures={setPictures}
              />
            </Grid>
          </Grid>
          {/* <Box className="flex w-full justify-end">
            <Button
              type="submit"
              variant="contained"
              color="success"
              // disabled={!methods.formState.isValid}
              loading={isLoading}
              sx={{ marginTop: "14px", alignSelf: "end" }}
            >
              {t(
                fetchedData
                  ? "locations.edit.updateButton"
                  : "locations.new.addButton"
              )}
            </Button>
          </Box> */}
        </Container>
      </form>
    </FormProvider>
  );
};
