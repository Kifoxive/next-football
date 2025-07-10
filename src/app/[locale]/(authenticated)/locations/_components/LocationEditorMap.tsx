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
  //   mapboxToken: string;
}

export const LocationEditorMap: React.FC<LocationEditorMapProps> = ({
  latitude,
  longitude,
  onChange,
  isError,
  // mapboxToken,
}) => {
  const t = useTranslations();

  return (
    <Box className="h-full">
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
        {/* <Marker
          longitude={initialLongitude}
          latitude={initialLatitude}
          draggable
          onDragEnd={(e) => {
            const { lngLat } = e;
            // setLng(lngLat.lng);
            // setLat(lngLat.lat);
            onChange(lngLat.lat, lngLat.lng);
          }}
        /> */}
        {latitude && longitude && (
          <Marker
            //   onClick={(e) => {
            //     e.originalEvent.stopPropagation();
            //     onMarkerClick(index);
            //   }}
            latitude={latitude}
            longitude={longitude}
            //   latitude={50.095}
            //   longitude={14.45}
            //   draggable
            anchor="bottom"
            //   pitchAlignment="map"
            //   onDragEnd={(e) => {
            //     const { lngLat } = e;
            //     onChange(lngLat.lat, lngLat.lng);
            //   }}
          >
            <Box>
              <PlaceIcon fontSize="large" color="info" />
            </Box>
          </Marker>
        )}
        {/* <NavigationControl position="top-right" /> */}
      </Map>
      {isError && (
        <Typography variant="caption" color="error" sx={{ ml: "16px" }}>
          {t("basic.noLocation")}
        </Typography>
      )}
    </Box>
  );
};
