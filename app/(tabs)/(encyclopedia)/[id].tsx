import SpeciesDetailScreen from "@/screens/SpeciesDetailScreen";
import {useLocalSearchParams} from "expo-router";
import Capture from "@/model/Capture";
import Specie from "@/model/Specie";
import Habitat from "@/model/Habitat";
import {Climate} from "@/model/Climate";
import {Diet} from "@/model/Diet";
import {Kingdom} from "@/model/Kingdom";
import {Class} from "@/model/Class";
import {Family} from "@/model/Family";
import CaptureDetail from "@/model/CaptureDetail";
import Location from "@/model/Location";

export default function details() {
    const {id: captureId} = useLocalSearchParams();
    const eurylaime = new Specie(1,"Eurylaime vert","Calyptomena viridis","Petit oiseau vert tout mignon, tout choupi",
        new Habitat("Jungle",Climate.Tropical),Diet.Herbivores,Kingdom.Animal,Class.Birds,Family.Bovids,
        [new Location(0,-57,23,10,0.7)],
        "https://s3.animalia.bio/animals/photos/full/1.25x1/lesser-green-broadbill-7150956749jpg.webp?id=7bb2b71f1c8886f6aba586e7d27a85a5");
    const myCapture = new Capture(Number(captureId),"",eurylaime,[
        new CaptureDetail(1,new Date(),false,new Location(23,23,323,1,1)),
        new CaptureDetail(2,new Date(),false,new Location(-45,-34,323,1,1)),
    ]);
    return (
        <SpeciesDetailScreen capture={myCapture} />
    );
}