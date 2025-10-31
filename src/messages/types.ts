import { Path } from "react-hook-form";

import arLocale from "./ar.json";
import enLocale from "./en.json";

export const en = enLocale;
export type Translations = typeof en;

export type tKeyPath = Path<Translations>;
export const ar = arLocale;

export type RestOfArgs<T extends unknown[]> = T extends [unknown, ...infer Rest] ? Rest : never;

export type Split<S extends string, D extends string = "."> = S extends `${infer T}${D}${infer U}`
  ? [T, ...Split<U, D>]
  : [S];

export type DeepLookup<T, Keys extends readonly string[]> = Keys extends [infer K, ...infer Rest]
  ? K extends keyof T
    ? Rest extends string[]
      ? DeepLookup<T[K], Rest>
      : never
    : never
  : T;

export type Join<K extends string, P extends string> = P extends "" ? K : `${K}.${P}`;

// Only recurse if T[K] is an object (but not strings)
export type DottedObjectKeys<T> = (
  T extends object
    ? {
        [K in keyof T & string]: T[K] extends object
          ? // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
            T[K] extends Function | any[]
            ? never
            : K | Join<K, DottedObjectKeys<T[K]>>
          : never;
      }[keyof T & string]
    : never
) extends infer D
  ? Extract<D, string>
  : never;
