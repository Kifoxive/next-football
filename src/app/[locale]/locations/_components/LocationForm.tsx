"use client";

import { Container } from "@mui/material";
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
import { AddPictures, IPictureItem } from "@/components/AddPictures";
import { BUILDING_TYPE_ENUM, config, FLOOR_TYPE_ENUM } from "@/config";
import { createClient } from "@/utils/supabase/client";
import { MarkdownEditor } from "@/components/form/components/MarkdownEditor";
import { LocationEditorMap } from "./LocationEditorMap";

type LocationFormProps = {
  fetchedData?: ILocation;

  onSubmitData: (data: ILocationForm, attachedPictures: IPictureItem[]) => void;
};

export const LocationForm: React.FC<LocationFormProps> = ({
  fetchedData,
  onSubmitData,
}) => {
  const t = useTranslations();
  const supabase = createClient();

  // pictures state to manipulate then locally
  const [pictures, setPictures] = useState<IPictureItem[]>([]);

  const formDefaultValues = {
    name: "",
    description: "",
    address: "",
    price_per_hour: 0,
    // floor_type: "",
    // building_type: "",
    // latitude: 0,
    // longitude: 0,
    image_list: [],
  };

  const methods = useForm<ILocationForm>({
    defaultValues: fetchedData || formDefaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(locationFormSchema(t)),
  });
  const { handleSubmit, watch, getValues, setValue, formState } = methods;

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

  const onSubmit = (formData: ILocationForm) => {
    onSubmitData(formData, pictures);
  };

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
      setPictures(signedUrls.filter(Boolean) as IPictureItem[]);
    };

    fetchImages();
  }, [fetchedData]);

  const latitude = watch("latitude");
  const longitude = watch("longitude");

  return (
    <FormProvider {...methods}>
      <form
        id="location_form"
        onSubmit={handleSubmit(onSubmit, (error) => console.log(error))}
      >
        <Container maxWidth="md" className="flex flex-col gap-4" disableGutters>
          <Grid container spacing={{ xs: 2, md: 4 }} columns={{ xs: 1, md: 2 }}>
            {/* left side (form) */}
            <Grid container spacing={2} columns={1} size={1}>
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
            </Grid>
            {/* right side (map) */}
            <Grid size={1}>
              <LocationEditorMap
                latitude={latitude}
                longitude={longitude}
                isError={Boolean(
                  latitude ? !latitude : formState.errors.latitude?.message
                )}
                onChange={(newLat, newLng) => {
                  setValue("latitude", newLat);
                  setValue("longitude", newLng);
                }}
              />
            </Grid>
          </Grid>
          <Grid size={3}>
            <MarkdownEditor
              name="description"
              label={t("games.form.description")}
            />
          </Grid>
          <AddPictures
            locationName={getValues("name")}
            pictures={pictures}
            onAddPicture={handleAddPicture}
            onRemovePicture={handleRemovePicture}
            onReorderPictures={setPictures}
          />
        </Container>
      </form>
    </FormProvider>
  );
};
