import Habitat from "@/model/domain/Habitat";
import {Diet} from "@/model/domain/Diet";
import {Kingdom} from "@/model/domain/Kingdom";
import {Class} from "@/model/domain/Class";
import {Family} from "@/model/domain/Family";
import Location from "@/model/domain/Location";

export default class Specie{
    id: number;
    name: string;
    scientificName: string;
    description: string;
    habitat: Habitat;
    diet: Diet;
    kingdom:Kingdom;
    class:Class;
    family:Family;
    locations:Location[];
    image: string;

    constructor(id: number, name: string, scientificName: string, description: string, habitat:Habitat, diet:Diet, kingdom:Kingdom, animalClass:Class, family:Family,locations:Location[], image: string) {
        this.id = id;
        this.name = name;
        this.scientificName = scientificName;
        this.description = description;
        this.habitat=habitat;
        this.diet=diet;
        this.kingdom=kingdom;
        this.class=animalClass;
        this.family=family;
        this.locations=locations;
        this.image = image;
    }
}