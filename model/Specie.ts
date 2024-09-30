import Habitat from "@/model/Habitat";
import {Diet} from "@/model/Diet";
import {Kingdom} from "@/model/Kingdom";
import {Class} from "@/model/Class";
import {Family} from "@/model/Family";
import Location from "@/model/Location";

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
    locations:Location[]
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