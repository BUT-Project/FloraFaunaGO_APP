import {render} from '@testing-library/react-native';
import { buildSpecie } from '@/shared/utils/funcs';
import SpecieListItem from "@/components/encyclopedia/SpecieListItem";
import  Specie from '@/model/domain/Specie';

describe('<CaptureListItem />', () => {
    test('Text renders correctly on CaptureListItem', () => {
        const specie: Specie = buildSpecie("1");
        const { getByText } = render(<SpecieListItem  specie={specie} captureId={"1"} />);
        getByText(specie.name);
    });
});