"use client";

import { useState, useEffect } from "react";
import { Box } from "@mui/material";

const images = [
  "/images/anthill.jpeg",
  "/images/baby_deer.webp",
  "/images/beetle.jpeg",
  "/images/bike.jpg",
  "/images/boars.jpg",
  "/images/deer.jpg",
  "/images/dog.jpg",
  "/images/field.jpg",
  "/images/fishing.jpg",
  "/images/forest_night.jpg",
  "/images/horses.jpg",
  "/images/mushrooms.webp",
  "/images/playground.jpg",
  "/images/road.jpg",
  "/images/swamp.avif",
  "/images/train.jpg",
  "/images/winter.jpeg",
];

const Hero = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Зміна кожні 5 секунд

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {images.map((src, i) => (
        <Box
          key={i}
          component="img"
          src={src}
          alt="Forest"
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: i === index ? 1 : 0,
            transition: "opacity 1s ease-in-out",
          }}
        />
      ))}
    </Box>
  );
};

export default Hero;
