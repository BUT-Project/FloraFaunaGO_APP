import { z } from "zod";
import { Class, Climate, Diet, Family, Kingdom } from "@/model/domain";

// Helper pour extraire les valeurs d'un enum string
function getEnumValues<T extends Record<string, string>>(enumObj: T) {
  return Object.values(enumObj) as [string, ...string[]];
}

// Fonction générique pour créer un schéma zod basé sur les valeurs de l'enum, avec fallback
export function safeEnum<T extends Record<string, string>>(enumObj: T, fallback: string) {
  const values = getEnumValues(enumObj);
  return z.string().pipe(
    z.enum(values).catch(fallback)
  );
}

export const ClimateSchema = safeEnum(Climate, "UNKNOWN");
export const KingdomSchema = safeEnum(Kingdom, Kingdom.ANIMALIA);
export const ClassSchema = safeEnum(Class, "UNKNOWN");
export const FamilySchema = safeEnum(Family, "UNKNOWN");
export const DietSchema = safeEnum(Diet, Diet.CARNIVORA);
