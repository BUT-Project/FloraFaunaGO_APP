import {render} from '@testing-library/react-native';

import CaptureListItem from "@/components/encyclopedia/CaptureListItem";
import Capture from "@/model/domain/Capture";
import Specie from "@/model/domain/Specie";
import Habitat from "@/model/domain/Habitat";
import {Climate} from "@/model/domain/Climate";
import {Diet} from "@/model/domain/Diet";
import {Kingdom} from "@/model/domain/Kingdom";
import {Class} from "@/model/domain/Class";
import {Family} from "@/model/domain/Family";
import Location from "@/model/domain/Location";

describe('<CaptureListItem />', () => {
    test('Text renders correctly on CaptureListItem', () => {

        const capture = new Capture(1,"photo",new Specie(1,"Eurylaime vert","Calyptomena viridis","Petit oiseau vert tout mignon, tout choupi",
            new Habitat("Jungle",Climate.Tropical),Diet.Herbivores,Kingdom.Animal,Class.Birds,Family.Bovids,
            [new Location(0,-57,23,10,0.7)],
            "photo"),[]);
        const { getByText } = render(<CaptureListItem capture={capture} />);
        getByText(capture.specie.name);
    });
});