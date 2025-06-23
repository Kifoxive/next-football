import { IPictureItem } from "@/components/AddPictures";
import { config } from "@/config";

import { createClient } from "@/utils/supabase/client";
import { Box, Paper } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const fallbackImage = "/images/showcase-missing-image.webp";

type PictureSectionProps = {
  // pictures: IPictureItem[];
  image_list: string[];
};

export const PictureSection: React.FC<PictureSectionProps> = ({
  image_list,
}) => {
  const supabase = createClient();

  const [index, setIndex] = useState<number>();
  const [pictures, setPictures] = useState<IPictureItem[]>([]);

  useEffect(() => {
    const fetchPictures = async () => {
      try {
        const imageList = image_list;
        if (!imageList) return;
        const signedUrls = await Promise.all(
          imageList.map(async (image_id: string) => {
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
            } as IPictureItem;
          })
        );

        const nonNullSignedUrls = signedUrls.filter(Boolean);
        const filledPictures =
          nonNullSignedUrls.length > 0
            ? [...nonNullSignedUrls]
            : [{ url: fallbackImage, file: null }]; // копія

        // Додаємо заглушки, якщо менше 3 фото
        while (filledPictures.length < 3) {
          filledPictures.push({ url: fallbackImage, file: null });
        }

        // filter null (in case of errors)
        setPictures(filledPictures as IPictureItem[]);
      } catch (e) {
        console.error(e);
      } finally {
      }
    };
    fetchPictures();
  }, []);

  const realPictures = pictures.filter(({ originalId }) => originalId);

  return (
    pictures.length > 0 && (
      <Box className="flex gap-2 ">
        {/* Left large image */}
        <Box
          className="relative w-[60%] aspect-[5/3] overflow-hidden"
          component={Paper}
          onClick={() => {
            setIndex(0);
          }}
        >
          <Image
            src={pictures[0].url}
            alt="Main location image"
            className="object-cover"
            fill
          />
        </Box>

        {/* Right column with two smaller images */}
        <Box className="flex flex-col gap-2 w-[40%]">
          {pictures.slice(1, 3).map((picture, index) => (
            <Box
              key={index}
              className="relative flex-1 overflow-hidden"
              component={Paper}
              onClick={() => {
                setIndex(index);
              }}
            >
              <Image
                src={picture.url}
                alt={`Image ${index}`}
                className="object-cover"
                fill
              />
            </Box>
          ))}
        </Box>
        <Lightbox
          carousel={{ finite: realPictures.length < 2 }}
          open={typeof index === "number"}
          close={() => setIndex(undefined)}
          index={index}
          slides={realPictures.map((pic) => ({ src: pic.url }))}
        />
      </Box>
    )
  );
};
