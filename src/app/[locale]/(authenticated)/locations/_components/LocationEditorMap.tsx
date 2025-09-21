"use client";
import Map, { Marker } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { Box, Typography } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import { useTranslations } from "next-intl";
import { mapStyleJson } from "@/utils/mapStyle";

interface LocationEditorMapProps {
  latitude: number;
  longitude: number;
  isError: boolean;
  onChange: (lat: number, lng: number) => void;
}

export const LocationEditorMap: React.FC<LocationEditorMapProps> = ({
  latitude,
  longitude,
  onChange,
  isError,
}) => {
  const t = useTranslations();

  return (
    <Box className="md:h-full">
      <Box className="h-[300px] md:h-full overflow-hidden rounded-md">
        <Map
          initialViewState={{
            latitude: latitude || 50.08,
            longitude: longitude || 14.42,
            zoom: 11,
          }}
          mapLib={import("maplibre-gl")}
          style={{ width: "100%", height: "100%" }}
          // mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
          // mapStyle="https://tiles.stadiamaps.com/styles/alidade_smooth.json"
          mapStyle={mapStyleJson}
          onClick={(e) => {
            const { lngLat } = e;
            onChange(lngLat.lat, lngLat.lng);
          }}
        >
          {latitude && longitude && (
            <Marker
              latitude={latitude}
              longitude={longitude}
              anchor="bottom"
              // draggable
            >
              <Box>
                <PlaceIcon fontSize="large" color="info" />
              </Box>
            </Marker>
          )}
          {/* <NavigationControl position="top-right" /> */}
        </Map>
      </Box>
      {isError && (
        <Typography variant="caption" color="error" sx={{ ml: "16px" }}>
          {t("basic.noLocation")}
        </Typography>
      )}
    </Box>
  );
};
