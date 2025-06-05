import {render} from '@testing-library/react-native';
import SpeciesImagePager from "@/components/encyclopedia/DetailsHeader";
import { buildSpecie } from '@/shared/utils/funcs';
import { Capture } from '@/model/domain';

describe('<SpeciesImagePager />', () => {
    test('Text renders correctly on SpeciesImagePager', () => {
    
        const specie = buildSpecie("1");
        const capture = new Capture("1","",specie,[])
        const { getByText } = render(<SpeciesImagePager specie={specie} capture={capture}/>);
        getByText(specie.name);
        getByText(specie.scientificName);
    });
});