import {render} from '@testing-library/react-native';

import SpecieListItem from "@/components/encyclopedia/SpecieListItem";
import { 
    Specie,
    Habitat,
    Climate,
    Diet,
    Kingdom,
    Class,
    Family
 } from '@/model/domain';

describe('<CaptureListItem />', () => {
    test('Text renders correctly on CaptureListItem', () => {

        const specie = new Specie(1, "Test", "Test2", "desc", new Habitat('jungle', Climate.Tropical), Diet.Carnivores, Kingdom.Animal, Class.Mammals, Family.Felidae, [], '');
        const { getByText } = render(<SpecieListItem  specie={specie} captureId={1} />);
        getByText(specie.name);
    });
});