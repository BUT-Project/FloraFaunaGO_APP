export const Kingdom = {
    ANIMALIA: "ANIMALIA",
    FUNGI: "FUNGI",
    PLANTAE: "PLANTAE"
} as const;

export type Kingdom = typeof Kingdom[keyof typeof Kingdom];