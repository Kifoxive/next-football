import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { Box, Fab, IconButton, Paper, Tooltip } from "@mui/material";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRef } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import toast from "react-hot-toast";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

export type IPictureItem = {
  file: File | null; // null if this is an existing photo
  url: string; // either local preview, or signed URL
  originalId?: string; // only for edited existing photos
};

type AddPicturesProps = {
  locationName: string;
  pictures: IPictureItem[];
  onAddPicture: (file: File) => void;
  onRemovePicture: (index: number) => void;
  onReorderPictures: (items: IPictureItem[]) => void;
};

export const AddPictures: React.FC<AddPicturesProps> = ({
  locationName,
  pictures,
  onAddPicture,
  onRemovePicture,
  onReorderPictures,
}) => {
  const t = useTranslations();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files !== null) {
      if (e.target.files[0].size > 5242880) {
        e.target.value = "";
        return toast.error(t("basic.size_too_big", { value: 5 }));
      }

      onAddPicture(e.target.files[0]);
      e.target.value = "";
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reordered = Array.from(pictures);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);

    onReorderPictures(reordered);
  };

  return (
    <Box>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="pictures" direction="horizontal" type="PICTURE">
          {(provided) => (
            <Box
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex gap-2 overflow-auto h-[160px] py-[20px]"
            >
              {pictures.map((picture, index) => (
                <Draggable
                  key={index.toString()}
                  draggableId={index.toString()}
                  index={index}
                >
                  {(provided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      component={Paper}
                      className="relative h-full aspect-2/1"
                    >
                      <Image
                        src={picture.url}
                        alt={locationName}
                        fill
                        className="object-cover"
                        sizes="240 120"
                        priority={index === 0}
                      />
                      <Box className="absolute right-1 top-1">
                        <Tooltip title={t("basic.picture_remove")}>
                          <IconButton
                            onClick={() => onRemovePicture(index)}
                            size="small"
                          >
                            <ClearIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              <Box className="h-full aspect-1/1 flex justify-center items-center">
                <Tooltip title={t("basic.picture_add")}>
                  <Fab
                    onClick={() => fileInputRef.current?.click()}
                    color="primary"
                    aria-label="add"
                  >
                    <AddPhotoAlternateIcon />
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </Fab>
                </Tooltip>
              </Box>
            </Box>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  );
};

// type PictureItemProps = {
//   item: IPictureItem;
//   locationName: string;
//   onRemove: () => void;
// };

// const PictureItem: React.FC<PictureItemProps> = ({
//   item,
//   locationName,
//   onRemove,
// }) => {
//   const t = useTranslations();

//   return (
//     <Box component={Paper} className="relative h-full aspect-2/1">
//       <Image src={item.url} alt={locationName} fill className="object-cover" />
//       <Box className="relative">
//         <Box className="absolute right-1 top-1">
//           <Tooltip title={t("basic.picture_remove")}>
//             <IconButton onClick={onRemove} aria-label="remove" size="small">
//               <ClearIcon />
//             </IconButton>
//           </Tooltip>
//         </Box>
//       </Box>
//     </Box>
//   );
// };
