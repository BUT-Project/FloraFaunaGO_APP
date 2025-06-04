import { Specie,Habitat,Diet,Kingdom,Class,Family, Climate } from "@/model/domain";

export  const buildSpecie = (id:number) => new Specie(
    id,
    `Specie ${id}`,
    `Scientific Name ${id}`,
    `Description of specie ${id}`,
    new Habitat('forest',Climate.TEMPERATE),
    Diet.CARNIVORA,
    Kingdom.ANIMALIA,
    Class.MAMMALIA,
    Family.FELIDAE,
    [],
    `https://example.com/specie${id}.jpg`
);