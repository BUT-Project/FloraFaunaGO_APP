import { render } from '@testing-library/react-native';

import CaptureDetails from "@/components/encyclopedia/CaptureDetails";
import CaptureDetail from "@/model/CaptureDetail";
import Location from "@/model/Location";
describe('<CaptureDetails />', () => {
    test('Text renders correctly on CaptureDetails', () => {
        const captureDetails = new CaptureDetail(1,new Date(),false,new Location(77,77,77,77,77));
        const { getByText } = render(<CaptureDetails captureDetail={captureDetails}/>);
        getByText(`Date : ${captureDetails.date.toLocaleDateString()}`);
        getByText(`Latitude : ${captureDetails.location.latitude.toString()}`);
        getByText(`Longitude : ${captureDetails.location.longitude.toString()}`);
        getByText(`Altitude : ${captureDetails.location.altitude.toString()}`);
        getByText(`Shiny : ${captureDetails.shiny? "Oui" : "Non"}`);
    });
});