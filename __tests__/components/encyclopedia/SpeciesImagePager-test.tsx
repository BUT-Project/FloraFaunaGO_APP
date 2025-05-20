import {render} from '@testing-library/react-native';
import SpeciesImagePager from "@/components/encyclopedia/DetailsHeader";
import { 
    Capture,
    Specie,
    Habitat,
    Climate,
    Diet,
    Kingdom,
    Family,
    Class,
 } from '@/model/domain';

describe('<SpeciesImagePager />', () => {
    test('Text renders correctly on SpeciesImagePager', () => {
        const name = "Test";
        const scientificName = "Test2";
        const specie = new Specie(1, name, scientificName, "desc", new Habitat('jungle', Climate.Tropical), Diet.Carnivores, Kingdom.Animal, Class.Mammals, Family.Felidae, [], '');
        const capture = new Capture(1,"",specie,[])
        const { getByText } = render(<SpeciesImagePager specie={specie} capture={capture}/>);
        getByText(name);
        getByText(scientificName);
    });
});