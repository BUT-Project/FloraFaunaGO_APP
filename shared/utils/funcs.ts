import { Specie,Habitat,Diet,Kingdom,Class,Family, Climate } from "@/model/domain";

export  const buildSpecie = (id:string) => new Specie(
    id,
    `Specie ${id}`,
    `Scientific Name ${id}`,
    `Description of specie ${id}`,
    `https://example.com/specie${id}.jpg`,
    new Habitat('forest',Climate.TEMPERATE),
    Diet.CARNIVORA,
    Kingdom.ANIMALIA,
    Class.MAMMALIA,
    Family.FELIDAE,
    [],
 
);