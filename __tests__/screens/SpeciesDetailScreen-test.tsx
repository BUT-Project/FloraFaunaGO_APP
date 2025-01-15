import { render } from '@testing-library/react-native';

import Capture from "@/model/Capture";
import Specie from "@/model/Specie";
import Habitat from "@/model/Habitat";
import {Climate} from "@/model/Climate";
import {Diet} from "@/model/Diet";
import {Kingdom} from "@/model/Kingdom";
import {Class} from "@/model/Class";
import {Family} from "@/model/Family";
import Location from "@/model/Location";

import SpeciesDetailScreen from "@/screens/SpeciesDetailScreen";

describe('<SpeciesDetailScreen />', () => {
    test('Text renders correctly on SpeciesDetailScreen', () => {
        const capture = new Capture(1,"photo",new Specie(1,"Eurylaime vert","Calyptomena viridis","Petit oiseau vert tout mignon, tout choupi",
            new Habitat("Jungle",Climate.Tropical),Diet.Herbivores,Kingdom.Animal,Class.Birds,Family.Bovids,
            [new Location(0,-57,23,10,0.7)],
            "photo"),[]);
        const { getByText } = render(<SpeciesDetailScreen capture={capture}/>);
        getByText(capture.specie.name);
        getByText(capture.specie.scientificName);
        getByText(capture.specie.diet);
        getByText(capture.specie.class);
        getByText(`${capture.specie.habitat.climate}, ${capture.specie.habitat.zone}`);
        getByText(capture.specie.family);
        getByText(capture.specie.kingdom);
        getByText(capture.specie.description);

    });
});