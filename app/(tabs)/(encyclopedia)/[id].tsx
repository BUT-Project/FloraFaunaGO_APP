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
    const myCapture = new Capture(Number(captureId),"https://cdn.discordapp.com/attachments/1284271143729107094/1292839375499165748/20241007_152113.jpg?ex=6707d4fe&is=6706837e&hm=7a616ef7082dc28ba24a9d805e19a3733d65fe898e8cc7a17caf5c47775f5cd6&",eurylaime,[
        new CaptureDetail(2,new Date(),false,new Location(23,23,323,1,1)),
        new CaptureDetail(3,new Date(),false,new Location(-45,-34,323,1,1)),
    ]);
    return (
        <SpeciesDetailScreen capture={myCapture} />
    );
}