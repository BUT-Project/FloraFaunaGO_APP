import { z } from "zod";
import { Class, Climate, Diet, Family, Kingdom } from "@/model/domain";
//import { tryParseEnum } from "../utils";

// export function safeEnum<T extends Record<string, string>>(
//   enumObj: T,
//   defaultValue: T[keyof T]
// ) {
//   return z
//     .string()
//     .transform((val) => tryParseEnum(enumObj,val) ?? defaultValue)
//     .pipe(z.nativeEnum(enumObj))
//     .default(defaultValue);
// }


// export function getValues<T extends Record<string, any>>(obj: T) {
//     return Object.values(obj) as [(typeof obj)[keyof T]]
// }
export const ClimateSchema = z.nativeEnum(Climate);
export const KingdomSchema = z.nativeEnum(Kingdom)
export const ClassSchema =  z.nativeEnum(Class)
export const FamilySchema = z.nativeEnum(Family)
export const DietSchema = z.nativeEnum(Diet);