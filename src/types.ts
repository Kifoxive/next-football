import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type ILocales = "en" | "uk" | "cz";

export type OptionType = { label: string; value: string | number };
