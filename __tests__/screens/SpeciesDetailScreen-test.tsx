import { renderWithProviders as render } from '@/shared/utils/renderWithProviders';
import SpeciesDetailScreen from '@/screens/SpeciesDetailScreen';
import { 
    Capture,
    CaptureDetail,
    Location,
} from '@/model/domain';

import { useGetSpecieByFamily } from '@/hooks/viewModels/useGetSpecieByFamily';
import { buildSpecie } from '@/shared/utils/funcs';

jest.mock('@/context/zustand/store/useAuthStore', () => ({
  useAuthStore: jest.fn().mockImplementation((selector) =>
    selector({ user: { id: '1', name: 'Test User' } })
  ),
}));

jest.mock('@/hooks/viewModels/useGetSpecieByFamily', () => ({
  useGetSpecieByFamily: jest.fn(),
}));

describe('<SpeciesDetailScreen />', () => {
    const mockSpecie = buildSpecie("1");
    const mockCapture = new Capture("1", "", mockSpecie, []);
    const captureDetails = [new CaptureDetail("1",new Date(),false, new Location(10,10,10,10,1))];
    const mockCaptureWithDetails = new Capture("1", "", mockSpecie, captureDetails);
        
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders NotCaptured component when the specie is not captured', async () => {
        const { getByText,getByTestId, } = render(<SpeciesDetailScreen specie={mockSpecie} capture={null} />);
        expect(getByText("Espèce non capturée")).toBeTruthy();
        expect(getByText("Où capturer cette espèce :")).toBeTruthy();
        expect(getByTestId("SpecieName").props.children).toBe(mockSpecie.name);
    });

    test('renders capture details when captures are available', async () => {
         (useGetSpecieByFamily as jest.Mock).mockReturnValue({
            captures: [],
            isLoading: false,
            fetchMoreData: jest.fn(),
            error: null,
            isListEnd: false,
            isLoadingMore: false,
        });
        const { getByText } = render(<SpeciesDetailScreen  specie={mockSpecie} capture={mockCaptureWithDetails} />);

        expect(getByText(`Date de capture : ${captureDetails[0].date.toLocaleDateString()}`)).toBeTruthy();
    });

    test('renders "Aucune espèce trouvée" when no family captures are available', async () => {
         (useGetSpecieByFamily as jest.Mock).mockReturnValue({
            captures: [],
            isLoading: false,
            fetchMoreData: jest.fn(),
            error: null,
            isListEnd: false,
            isLoadingMore: false,
        });
        const { getByText } = render(<SpeciesDetailScreen specie={mockSpecie} capture={mockCapture} />);
        expect(getByText('Aucune espèce trouvée')).toBeTruthy();
    });

    test('renders the "Pas plus de capture pour le moment" message in family section when no more captures are available', async () => {
        (useGetSpecieByFamily as jest.Mock).mockReturnValue({
            captures: [mockCapture],
            isLoading: false,
            fetchMoreData: jest.fn(),
            error: null,
            isListEnd: true,
            isLoadingMore: false,
        });
        const { getByText } = render(<SpeciesDetailScreen specie={mockSpecie} capture={mockCapture}/>);
        expect(getByText('Pas plus de capture pour le moment.')).toBeTruthy();
    });

});