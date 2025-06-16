export enum Class {
    // Vertébrés
    MAMMALIA = "MAMMALIA",           // Mammifères
    AVES = "AVES",                   // Oiseaux
    REPTILIA = "REPTILIA",           // Reptiles
    AMPHIBIA = "AMPHIBIA",           // Amphibiens
    ACTINOPTERYGII = "ACTINOPTERYGII", // Poissons osseux (majorité des poissons)
    CHONDRICHTHYES = "CHONDRICHTHYES", // Poissons cartilagineux (requins, raies)

    // Invertébrés
    INSECTA = "INSECTA",             
    ARACHNIDA = "ARACHNIDA",        
    MYRIAPODA = "MYRIAPODA",         
    CRUSTACEA = "CRUSTACEA",        
    GASTROPODA = "GASTROPODA",       
    BIVALVIA = "BIVALVIA",          

    // Plantes
    MAGNOLIOPSIDA = "MAGNOLIOPSIDA", // Plantes à fleurs (dicotylédones)
    LILIOPSIDA = "LILIOPSIDA",       // Monocotylédones (herbes, orchidées…)
    PINOPSIDA = "PINOPSIDA",         // Conifères
    BRYOPSIDA = "BRYOPSIDA",         // Mousses
    POLYPODIOPSIDA = "POLYPODIOPSIDA", // Fougères
    SAPINDACEAE = "SAPINDACEAE", // Sapindacées (ex. châtaignier, marronnier)
    LAMIACEAE = "LAMIACEAE", // Lamiacées (ex. menthe, basilic)
    MALVACEAE = "MALVACEAE", // Malvacées (ex. hibiscus, guimauve)
    FAGACEAE = "FAGACEAE", // Fagacées (ex. chêne, hêtre)
    ASTERACEAE = "ASTERACEAE", // Astéracées (ex. marguerite, tournesol)
    
    // Champignons
    AGARICOMYCETES = "AGARICOMYCETES", // Champignons à chapeau (ex. cèpes)
    ASCOMYCETES = "ASCOMYCETES",       // Moisissures, levures

    UNKNOWN = "UNKNOWN"
}


// export const Class = {
//     MAMMALIA: "MAMMALIA",
//     INSECTA : "INSECTA",
//     AVES : "AVES",                   
//     REPTILIA : "REPTILIA",           
//     AMPHIBIA :"AMPHIBIA",
//     LAMIACEAE: "LAMIACEAE",
//     MALVACEAE: "MALVACEAE",
//     FAGACEAE : "FAGACEAE",
//     ASTERACEAE : "ASTERACEAE",
//     SAPINDACEAE : "SAPINDACEAE",
//     MAGNOLIOPSIDA : "MAGNOLIOPSIDA",
//     ACTINOPTERYGII : "ACTINOPTERYGII",
//     UNKNOWN: "UNKNOWN",
//     unknown :"unknown"
// } as const;

// export type Class = (typeof Class)[keyof typeof Class];
