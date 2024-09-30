import EncyclopediaScreen from "@/screens/EncyclopediaScreen";
import Specie from "@/model/Specie";
import Habitat from "@/model/Habitat";
import {Climate} from "@/model/Climate";
import {Diet} from "@/model/Diet";
import {Class} from "@/model/Class";
import {Kingdom} from "@/model/Kingdom";
import {Family} from "@/model/Family";
import Capture from "@/model/Capture";

const eurylaime = new Specie(1,"Eurylaime vert","Calyptomena viridis","Petit oiseau vert tout mignon, tout choupi",
    new Habitat("Jungle",Climate.Tropical),Diet.Herbivores,Kingdom.Animal,Class.Birds,Family.Bovids,
    "https://s3.animalia.bio/animals/photos/full/1.25x1/lesser-green-broadbill-7150956749jpg.webp?id=7bb2b71f1c8886f6aba586e7d27a85a5");
const coccinelle = new Specie(2,"Coccinelle","Coccinella","Petit insect rouge et noir",
    new Habitat("Plaine",Climate.Continental),Diet.Herbivores,Kingdom.Animal,Class.Insects,Family.Coccinellidae,
    "https://s3.animalia.bio/animals/photos/full/1.25x1/2560px-ladybird-2562155830.webp?id=4746a43a8119d39733d3525585e19553");
const squirel = new Specie(3,"Écureuil gris","Sciurus carolinensis",
        "L'Écureuil gris (Sciurus carolinensis) est une espèce de mammifères rongeurs arboricoles, commun dans l'Est de l'Amérique du Nord. Généralement gris, il peut aussi avoir un pelage brun, noir ou, plus rarement, blanc ou cannelle. L'Écureuil gris est très abondant notamment dans la grande région de Montréal alors qu'il est majoritairement brun, plus ou moins foncé, à Toronto.",
        new Habitat("Foret",Climate.Continental),Diet.Herbivores,Kingdom.Animal,Class.Mammals,Family.Sciuridae,
        "https://s3.animalia.bio/animals/photos/full/1.25x1/1200px-sciurus-carolinensis-gotigersjfjpg.webp?id=ebc407568eff02cd06c9edf17b71ec10");

export default function Encyclopedia() {
  const captures = [
      new Capture(1,"",[])
  ]
  return (
      <EncyclopediaScreen captures={captures}/>
  );
}

