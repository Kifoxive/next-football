"use client";
import { useEffect, useRef } from "react";

export function useDocumentTitle(title: string, prevailOnUnmount = true) {
  const defaultTitle = useRef("Next Football");

  useEffect(() => {
    document.title = `${title} | ${defaultTitle.current}`;
  }, [title]);

  useEffect(() => () => {
    if (!prevailOnUnmount) {
      document.title = defaultTitle.current;
    }
  });
}
