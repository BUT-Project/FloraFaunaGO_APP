import {render} from '@testing-library/react-native';

import SpeciesImagePager from "@/components/encyclopedia/SpeciesImagePager";
import Capture from '@/model/domain/Capture';
import Specie from '@/model/domain/Specie';
import Habitat from '@/model/domain/Habitat';
import {Climate} from '@/model/domain/Climate';
import {Diet} from '@/model/domain/Diet';
import {Class} from '@/model/domain/Class';
import {Family} from '@/model/domain/Family';
import {Kingdom} from '@/model/domain/Kingdom';

describe('<SpeciesImagePager />', () => {
    test('Text renders correctly on SpeciesImagePager', () => {
        const name = "Test";
        const scientificName = "Test2";
        const specie1 = new Specie(1, name, scientificName, "desc", new Habitat('jungle', Climate.Tropical), Diet.Carnivores, Kingdom.Animal, Class.Mammals, Family.Felidae, [], '');
        
        const capture = new Capture(1,"",specie1,[])
        const { getByText } = render(<SpeciesImagePager capture={capture} isCaptured={false}/>);
        getByText(name);
        getByText(scientificName);
    });
});