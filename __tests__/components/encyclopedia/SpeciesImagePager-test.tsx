import {render} from '@testing-library/react-native';

import SpeciesImagePager from "@/components/encyclopedia/SpeciesImagePager";

describe('<SpeciesImagePager />', () => {
    test('Text renders correctly on SpeciesImagePager', () => {
        const name = "Test";
        const scientificName = "Test2";
        const { getByText } = render(<SpeciesImagePager speciePhoto={""} userPhoto={null} specieName={name} specieScientificName={scientificName}/>);
        getByText(name);
        getByText(scientificName);
    });
});