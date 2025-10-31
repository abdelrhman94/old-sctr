import { Path } from "react-hook-form";

import { useTranslations } from "next-intl";

import { DeepLookup, DottedObjectKeys, RestOfArgs, Split, Translations } from "@/messages/types";

type TRest = RestOfArgs<Parameters<ReturnType<typeof useTranslations>>>;

function useAppTranslations<T extends DottedObjectKeys<Translations>>(
  namespace: T
): (key: Path<DeepLookup<Translations, Split<T>>>, ...args: TRest) => string;

function useAppTranslations(
  namespace?: undefined
): (key: Path<Translations>, ...args: TRest) => string;

function useAppTranslations(namespace?: string) {
  const t = useTranslations(namespace);
  return t;
}

export default useAppTranslations;

export type UseAppTranslationsReturn = ReturnType<typeof useAppTranslations>;
