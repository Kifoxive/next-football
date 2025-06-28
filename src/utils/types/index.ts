import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type LocalesType = "en" | "uk" | "cz";

export type OptionType = { label: React.ReactNode; value: string | number };
