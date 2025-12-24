import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type LocalesType = "en" | "uk" | "cs";

export type OptionType = {
  label: React.ReactNode;
  value: string | number;
  disabled?: boolean;
};

export type SimpleOptionType = { label: string; value: string };

import {
  AbstractIntlMessages,
  NamespaceKeys,
  NestedKeyOf,
  useTranslations,
} from "next-intl";

export type TFunction<
  NestedKey extends NamespaceKeys<
    AbstractIntlMessages,
    NestedKeyOf<AbstractIntlMessages>
  > = never,
> = ReturnType<
  typeof useTranslations<
    NestedKey extends never ? NestedKeyOf<AbstractIntlMessages> : NestedKey
  >
>;
