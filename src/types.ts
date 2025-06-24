import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type ILocales = "en" | "uk" | "cz";

export type OptionType = { label: React.ReactNode; value: string | number };
