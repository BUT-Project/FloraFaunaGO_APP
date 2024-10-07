import Habitat from "@/model/Habitat";
import {Diet} from "@/model/Diet";
import {Kingdom} from "@/model/Kingdom";
import {Class} from "@/model/Class";
import {Family} from "@/model/Family";
import Location from "@/model/Location";
import Specie from "@/model/Specie"
import {Climate} from "@/model/Climate";
import User from "@/model/User";
import Capture from "@/model/Capture";
import CaptureDetail from "@/model/CaptureDetail";

const specie1= new Specie(1, 'Lion', 'Panthera leo', 'Le roi de la jungle', new Habitat('jungle', Climate.Tropical), Diet.Carnivores, Kingdom.Animal, Class.Mammals, Family.Bovids, [], 'image'
)


const capture1: Capture = new Capture(1, 'Lion',specie1, []);
const capture2: Capture = new Capture(2, 'Tigre', specie1, []);
const capture3: Capture = new Capture(3, 'Éléphant', specie1, []);
const capture4: Capture = new Capture(4, 'Zèbre', specie1, []);
const capture5: Capture = new Capture(5, 'Girafe', specie1, []);

const location1: Location = new Location(1,2,3, -1.2921, 36.8219); // Exemple de localisation
const location2: Location = new Location(1,2,3, -2.2921, 35.8219);   // Un autre exemple
const location3: Location = new Location(3, 4, 5, -3.2921, 34.8219); // Autre localisation
const location4: Location = new Location(4, 5, 6, -4.2921, 33.8219); // Une autre localisation

const captureDetail1: CaptureDetail = new CaptureDetail(1, new Date('2024-01-01'), false, location1);
const captureDetail2: CaptureDetail = new CaptureDetail(2, new Date('2024-02-01'), true, location2);

export const SpecieList = [
    new Specie(1, 'Lion', 'Panthera leo', 'Le roi de la jungle', new Habitat('jungle', Climate.Tropical), Diet.Carnivores, Kingdom.Animal, Class.Mammals, Family.Bovids, [location1, location2], 'image'),
    new Specie(2, 'Tigre', 'Panthera tigris', 'Le plus grand des félins.', new Habitat('forêt tropicale', Climate.Tropical), Diet.Carnivores, Kingdom.Animal, Class.Mammals, Family.Bovids, [location2], 'https://example.com/images/tiger.jpg'),
    new Specie(3, 'Éléphant', 'Loxodonta africana', 'Les éléphants sont les plus grands animaux terrestres.', new Habitat('savane', Climate.Tropical), Diet.Herbivores, Kingdom.Animal, Class.Mammals, Family.Bovids, [location1, location3], 'https://example.com/images/elephant.jpg'),
    new Specie(4, 'Zèbre', 'Equus quagga', 'Le zèbre est un mammifère herbivore de la famille des équidés.', new Habitat('savane', Climate.Tropical), Diet.Herbivores, Kingdom.Animal, Class.Mammals, Family.Bovids, [location1, location4], 'https://example.com/images/zebra.jpg'),
    new Specie(5, 'Girafe', 'Giraffa camelopardalis', 'La girafe est le plus grand mammifère terrestre.', new Habitat('savane', Climate.Tropical), Diet.Herbivores, Kingdom.Animal, Class.Mammals, Family.Bovids, [location1, location3], 'https://example.com/images/giraffe.jpg'),
    new Specie(6, 'Hippopotame', 'Hippopotamus amphibius', 'L\'hippopotame est un grand mammifère semi-aquatique.', new Habitat('rivières', Climate.Tropical), Diet.Herbivores, Kingdom.Animal, Class.Mammals, Family.Bovids, [location2, location4], 'https://example.com/images/hippo.jpg')
];

export const UserList = [
    new User(1, 'JohnDoe', 'johndoe@example.com', 'hashedpassword1', new Date('2022-01-01'), [capture1, capture2]),
    new User(2, 'JaneDoe', 'janedoe@example.com', 'hashedpassword2', new Date('2022-02-01'), [capture3]),
    new User(3, 'AliceSmith', 'alicesmith@example.com', 'hashedpassword3', new Date('2022-03-01'), []),
    new User(4, 'BobBrown', 'bobbrown@example.com', 'hashedpassword4', new Date('2022-04-01'), [capture1])
];
export const CaptureList = [
    new Capture(1, 'https://example.com/photos/capture1.jpg', specie1, [captureDetail1, captureDetail2]),
    new Capture(2, 'https://example.com/photos/capture2.jpg', specie1, [captureDetail2]),
    new Capture(3, 'https://example.com/photos/capture3.jpg', specie1, [captureDetail1]),
    new Capture(4, 'https://example.com/photos/capture4.jpg', specie1, [captureDetail2])
];