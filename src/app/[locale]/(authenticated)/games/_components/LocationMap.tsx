"use client";
import Map, { Marker } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { Box } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import { mapStyleJson } from "@/utils/mapStyle";

// import { useTranslations } from "next-intl";

interface LocationMapProps {
  latitude: number;
  longitude: number;
  address: string;
}

export const LocationMap: React.FC<LocationMapProps> = ({
  latitude,
  longitude,
}) => {
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
      >
        {latitude && longitude && (
          <Marker latitude={latitude} longitude={longitude} anchor="bottom">
            <PlaceIcon fontSize="large" color="info" />
          </Marker>
        )}
      </Map>
    </Box>
  );
};
