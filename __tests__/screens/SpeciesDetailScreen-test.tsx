import {render, waitFor} from '@testing-library/react-native';
import Capture from "@/model/domain/Capture";
import Specie from "@/model/domain/Specie";
import Habitat from "@/model/domain/Habitat";
import {Climate} from "@/model/domain/Climate";
import {Diet} from "@/model/domain/Diet";
import {Kingdom} from "@/model/domain/Kingdom";
import {Class} from "@/model/domain/Class";
import {Family} from "@/model/domain/Family";
import SpeciesDetailScreen from "@/screens/SpeciesDetailScreen";
import {useGetCaptureById} from "@/hooks/useGetCaptureById";
import {useGetCaptureByFamily} from "@/hooks/useGetCaptureByFamily";
import CaptureDetail from '@/model/domain/CaptureDetail';
import Location from '@/model/domain/Location';

// Mock les hooks en utilisant jest.Mock pour donner le bon type à leur signature
jest.mock("@/hooks/useGetCaptureById", () => ({
    __esModule: true,
    useGetCaptureById: jest.fn() as jest.Mock<typeof useGetCaptureById>,
}));
jest.mock("@/hooks/useGetCaptureByFamily", () => ({
    __esModule: true,
    useGetCaptureByFamily: jest.fn() as jest.Mock<typeof useGetCaptureByFamily>,
}));

describe('<SpeciesDetailScreen />', () => {
    const specie = new Specie(1, "Lion", "Panthera leo", "Le roi des animaux", new Habitat('savanna', Climate.Tropical), Diet.Carnivores, Kingdom.Animal, Class.Mammals, Family.Felidae, [], '');
    const mockCapture = new Capture(1, "", specie, []);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders loading indicator when data is loading', () => {
        (useGetCaptureById as jest.Mock).mockReturnValue({ capture: null, isLoading: true, error: null });
        (useGetCaptureByFamily as jest.Mock).mockReturnValue({ captures: [], isLoading: false, fetchMoreData: jest.fn(), error: null, isListEnd: false, isLoadingMore: false });
        const { debug } = render(<SpeciesDetailScreen captureId={1} />);
        debug();
        const { getByTestId } = render(<SpeciesDetailScreen captureId={1} />);
        const loadingIndicator = getByTestId('loading-indicator');
        expect(loadingIndicator).toBeTruthy();
    });

    test('renders error message when there is an error', async () => {
        useGetCaptureById.mockReturnValue({ capture: null, isLoading: false, error: 'Error fetching capture' });
        useGetCaptureByFamily.mockReturnValue({ captures: [], isFamLoading: false, fetchMoreData: jest.fn(), errorFam: null, isListEnd: false, isLoadingMore: false });
        (useGetCaptureById as jest.Mock).mockReturnValue({ capture: mockCapture, isLoading: false, error: null });
        const { getByText } = render(<SpeciesDetailScreen captureId={1} />);

        await waitFor(() => getByText('Error fetching capture'));
        expect(getByText('Error fetching capture')).toBeTruthy();
    });

    test('renders ? as specie info because its not captured', async () => {
        (useGetCaptureById as jest.Mock).mockReturnValue({ capture: mockCapture, isLoading: false, error: null });
        (useGetCaptureByFamily as jest.Mock).mockReturnValue({ captures: [], isLoading: false, fetchMoreData: jest.fn(), error: null, isListEnd: false, isLoadingMore: false });

        const { getByText,queryByText, queryAllByText } = render(<SpeciesDetailScreen captureId={1} />);
        
        // Vérification des données du `specie`
        expect(getByText(mockCapture.specie.name)).toBeTruthy();
        expect(getByText(mockCapture.specie.scientificName)).toBeTruthy();
        expect(queryByText(mockCapture.specie.diet)).toBeFalsy(); // La diète ne doit pas être affichée
        expect(queryByText(mockCapture.specie.class.toString())).toBeFalsy(); // La classe ne doit pas être affichée
        expect(queryAllByText('?')).toBeTruthy(); 
        expect(queryByText(mockCapture.specie.family.toString())).toBeFalsy(); 
        expect(queryByText(mockCapture.specie.kingdom.toString())).toBeFalsy(); 
        expect(queryByText(mockCapture.specie.description)).toBeFalsy(); 
    });

    test('displays "Espèce introuvable" when no capture is found', () => {
        useGetCaptureById.mockReturnValue({ capture: null, isLoading: false, error: null });
        useGetCaptureByFamily.mockReturnValue({ captures: [], isFamLoading: false, fetchMoreData: jest.fn(), errorFam: null, isListEnd: false, isLoadingMore: false });

        const { getByText } = render(<SpeciesDetailScreen captureId={1} />);
        expect(getByText('Espèce introuvalble...')).toBeTruthy();
    });

    test('renders capture details when captures are available', async () => {
        const captureDetails = [new CaptureDetail(1,new Date(),false, new Location(10,10,10,10,1))];
        const mockCaptureWithDetails = new Capture(1, "", specie, captureDetails);
        
        useGetCaptureById.mockReturnValue({ capture: mockCaptureWithDetails, isLoading: false, error: null });
        useGetCaptureByFamily.mockReturnValue({ captures: [], isFamLoading: false, fetchMoreData: jest.fn(), errorFam: null, isListEnd: false, isLoadingMore: false });

        const { getByText } = render(<SpeciesDetailScreen captureId={1} />);
        await waitFor(() => getByText('Vos captures :'));

        expect(getByText(`Date de capture : ${captureDetails[0].date.toLocaleDateString()}`)).toBeTruthy();
    });

    test('renders "Aucune espèce trouvée" when no family captures are available', async () => {
        useGetCaptureById.mockReturnValue({ capture: mockCapture, isLoading: false, error: null });
        useGetCaptureByFamily.mockReturnValue({ captures: [], isFamLoading: false, fetchMoreData: jest.fn(), errorFam: null, isListEnd: false, isLoadingMore: false });

        const { getByText } = render(<SpeciesDetailScreen captureId={1} />);
        await waitFor(() => getByText('Aucune espèce trouvée'));
        expect(getByText('Aucune espèce trouvée')).toBeTruthy();
    });

    test('renders the "Pas plus de capture pour le moment" message in family section when no more captures are available', async () => {
        useGetCaptureById.mockReturnValue({ capture: mockCapture, isLoading: false, error: null });
        useGetCaptureByFamily.mockReturnValue({
            captures: [mockCapture],
            isFamLoading: false,
            fetchMoreData: jest.fn(),
            errorFam: null,
            isListEnd: true,
            isLoadingMore: false
        });

        const { getByText } = render(<SpeciesDetailScreen captureId={1} />);
        await waitFor(() => getByText('Pas plus de capture pour le moment.'));
        expect(getByText('Pas plus de capture pour le moment.')).toBeTruthy();
    });
});