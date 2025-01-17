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
import {Sucess} from "@/model/Sucess";

const location1: Location = new Location(1,2,3, -1.2921, 36.8219);
const location2: Location = new Location(1,2,3, -2.2921, 35.8219);   
const location3: Location = new Location(3, 4, 5, -3.2921, 34.8219); 
const location4: Location = new Location(3, 4, 5, -3.2921, 34.8219); 
const location5: Location = new Location(5, 6, 7, -5.2921, 32.8219);
const location6: Location = new Location(6, 7, 8, -6.2921, 31.8219);
const location7: Location = new Location(7, 8, 9, -7.2921, 30.8219);
const location8: Location = new Location(8, 9, 10, -8.2921, 29.8219);
const location9: Location = new Location(9, 10, 11, -9.2921, 28.8219);

const specie1 = new Specie(1, 'Lion', 'Panthera leo', 'Le roi de la jungle', new Habitat('jungle', Climate.Tropical), Diet.Carnivores, Kingdom.Animal, Class.Mammals, Family.Bovids, [location1, location2], 'https://upload.wikimedia.org/wikipedia/commons/6/6f/011_The_lion_king_Tryggve_in_the_Serengeti_National_Park_Photo_by_Giles_Laurent.jpg');
const specie2 = new Specie(2, 'Tigre', 'Panthera tigris', 'Le plus grand des félins.', new Habitat('forêt tropicale', Climate.Tropical), Diet.Carnivores, Kingdom.Animal, Class.Mammals, Family.Bovids, [location2], 'https://upload.wikimedia.org/wikipedia/commons/4/41/Siberischer_tiger_de_edit02.jpg');
const specie3 = new Specie(3, 'Éléphant', 'Loxodonta africana', 'Les éléphants sont les plus grands animaux terrestres.', new Habitat('savane', Climate.Tropical), Diet.Herbivores, Kingdom.Animal, Class.Mammals, Family.Bovids, [location1, location3], 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/African_Bush_Elephant.jpg/1200px-African_Bush_Elephant.jpg');
const specie4 = new Specie(4, 'Zèbre', 'Equus quagga', 'Le zèbre est un mammifère herbivore de la famille des équidés.', new Habitat('savane', Climate.Tropical), Diet.Herbivores, Kingdom.Animal, Class.Mammals, Family.Bovids, [location1, location4], 'https://upload.wikimedia.org/wikipedia/commons/0/0a/Zebra_zoo-leipzig.jpg');
const specie5 = new Specie(5, 'Girafe', 'Giraffa camelopardalis', 'La girafe est le plus grand mammifère terrestre.', new Habitat('savane', Climate.Tropical), Diet.Herbivores, Kingdom.Animal, Class.Mammals, Family.Bovids, [location1, location3], 'https://www.natura-sciences.com/wp-content/uploads/2012/10/Girafe-antiquorum-male.jpg.webp');
const specie6 = new Specie(6, 'Hippopotame', 'Hippopotamus amphibius', 'L\'hippopotame est un grand mammifère semi-aquatique.', new Habitat('rivières', Climate.Tropical), Diet.Herbivores, Kingdom.Animal, Class.Mammals, Family.Bovids, [location2, location4], 'https://toutelathailande.fr/wp-content/uploads/2024/09/Moo-Deng-bebe-hippopotame-nain.jpg');
const specie7 = new Specie(7, 'Rhinocéros', 'Rhinoceros unicornis', 'Le rhinocéros est un mammifère robuste et herbivore.', new Habitat('plaine', Climate.Tropical), Diet.Herbivores, Kingdom.Animal, Class.Mammals, Family.Bovids, [location5, location6], 'https://blog.makila.fr/animaux-safari-afrique/wp-content/gallery/rhinoceros-noir/hooked-lipped-or-black-rhino-at-ongava-etosha-national-park-namibia-photo-dana-allen.jpg');
const specie8 = new Specie(8, 'Guépard', 'Acinonyx jubatus', 'Le mammifère le plus rapide sur terre.', new Habitat('savane', Climate.Tropical), Diet.Carnivores, Kingdom.Animal, Class.Mammals, Family.Bovids, [location5, location7], 'https://www.easytravel.co.tz/wp-content/uploads/2020/09/Adult-Cheetah-Cornering-Savannah-Mara-Kenya.jpg');
const specie9 = new Specie(9, 'Panda géant', 'Ailuropoda melanoleuca', 'Symbole de la conservation de la nature.', new Habitat('forêt de bambous', Climate.Temperate), Diet.Herbivores, Kingdom.Animal, Class.Mammals, Family.Bovids, [location8], 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Grosser_Panda.JPG');
const specie10 = new Specie(10, 'Orang-outan', 'Pongo pygmaeus', 'Un grand singe vivant dans les forêts tropicales.', new Habitat('forêt tropicale', Climate.Tropical), Diet.Omnivores, Kingdom.Animal, Class.Mammals, Family.Bovids, [location9], 'https://www.conservation-nature.fr/wp-content/uploads/2021/02/orang-outan-1.jpg');
const specie11 = new Specie(11, 'Koala', 'Phascolarctos cinereus', 'Un marsupial herbivore qui vit dans les forêts d\'eucalyptus en Australie.', new Habitat('forêt d\'eucalyptus', Climate.Temperate), Diet.Herbivores, Kingdom.Animal, Class.Mammals, Family.Phascolarctides, [location1], 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Koala_climbing_tree.jpg/400px-Koala_climbing_tree.jpg');
const specie12 = new Specie(12, 'Loup gris', 'Canis lupus', 'Un prédateur social vivant en meutes.', new Habitat('forêts et toundras', Climate.Temperate), Diet.Carnivores, Kingdom.Animal, Class.Mammals, Family.Canid, [location7, location8], 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Canis_lupus_laying.jpg/400px-Canis_lupus_laying.jpg');
const specie13 = new Specie(13, 'Manchot empereur', 'Aptenodytes forsteri', 'Un oiseau qui vit en Antarctique.', new Habitat('banquise', Climate.Polar), Diet.Carnivores, Kingdom.Animal, Class.Birds, Family.Spheniscidae, [location2], 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Emperor_Penguin_with_chicks.jpg/400px-Emperor_Penguin_with_chicks.jpg');
const specie14 = new Specie(14, 'Dauphin', 'Delphinus delphis', 'Un mammifère marin très intelligent.', new Habitat('océans', Climate.Temperate), Diet.Carnivores, Kingdom.Animal, Class.Mammals, Family.Delphinidae, [location8, location9], 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Common_Dolphin.jpg/400px-Common_Dolphin.jpg');
const specie15 = new Specie(15, 'Aigle royal', 'Aquila chrysaetos', 'Un grand oiseau de proie.', new Habitat('montagnes et vallées', Climate.Temperate), Diet.Carnivores, Kingdom.Animal, Class.Birds, Family.Accipitridae, [location3], 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Golden_Eagle_in_flight_-_5.jpg/400px-Golden_Eagle_in_flight_-_5.jpg');
const specie16 = new Specie(16, 'Tortue verte', 'Chelonia mydas', 'Une grande tortue marine herbivore.', new Habitat('océans tropicaux', Climate.Tropical), Diet.Herbivores, Kingdom.Animal, Class.Reptiles, Family.Testudines, [location5], 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Green_turtle_swimming_over_coral_reefs_in_Kona.jpg/400px-Green_turtle_swimming_over_coral_reefs_in_Kona.jpg');
const specie17 = new Specie(17, 'Cobra royal', 'Ophiophagus hannah', 'Le plus grand serpent venimeux.', new Habitat('forêts tropicales', Climate.Tropical), Diet.Carnivores, Kingdom.Animal, Class.Reptiles, Family.Snakes, [location4], 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/King_Cobra_Bangalore.jpg/400px-King_Cobra_Bangalore.jpg');
const specie18 = new Specie(18, 'Fennec', 'Vulpes zerda', 'Un renard du désert avec de grandes oreilles.', new Habitat('déserts', Climate.Dry), Diet.Omnivores, Kingdom.Animal, Class.Mammals, Family.Canid, [location6], 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Fennec_Fox_Vulpes_zerda.jpg/400px-Fennec_Fox_Vulpes_zerda.jpg');
const specie19 = new Specie(19, 'Caméléon panthère', 'Furcifer pardalis', 'Un caméléon coloré de Madagascar.', new Habitat('forêts tropicales', Climate.Tropical), Diet.Insectivores, Kingdom.Animal, Class.Reptiles, Family.Lizards, [location7], 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Panther_chameleon_%28Furcifer_pardalis%29_male_Ambohitantely.jpg/400px-Panther_chameleon_%28Furcifer_pardalis%29_male_Ambohitantely.jpg');
const specie20 = new Specie(20, 'Paon bleu', 'Pavo cristatus', 'Un oiseau célèbre pour son plumage éclatant.', new Habitat('forêts ouvertes', Climate.Tropical), Diet.Omnivores, Kingdom.Animal, Class.Birds, Family.Leporids, [location7], 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Peacock_Plumage.jpg/400px-Peacock_Plumage.jpg');

const captureDetail1: CaptureDetail = new CaptureDetail(1, new Date('2024-01-01'), false, location1);
const captureDetail2: CaptureDetail = new CaptureDetail(2, new Date('2024-02-01'), true, location2);

const capture1: Capture = new Capture(1, 'Lion',specie1,  [captureDetail1, captureDetail2]);
const capture2: Capture = new Capture(2, 'Tigre', specie2,  [captureDetail1]);
const capture3: Capture = new Capture(3,null, specie3, []);
const capture4: Capture = new Capture(4, null, specie4, []);
const capture5: Capture = new Capture(5, null, specie5, []);
const capture6: Capture = new Capture(6, null, specie6, []);
const capture7: Capture = new Capture(7, 'Rhinocéros', specie7, []);
const capture8: Capture = new Capture(8, 'Guépard', specie8, []);
const capture9: Capture = new Capture(9, 'Panda géant', specie9, []);
const capture10: Capture = new Capture(10, null, specie10, []);
const capture11: Capture = new Capture(11, null, specie11, []);
const capture12: Capture = new Capture(12, null, specie12, []);
const capture13: Capture = new Capture(13, null, specie13, []);
const capture14: Capture = new Capture(14, null, specie14, []);
const capture15: Capture = new Capture(15, null, specie15, []);
const capture16: Capture = new Capture(16, null, specie16, []);
const capture17: Capture = new Capture(17, null, specie17, []);
const capture18: Capture = new Capture(18, null, specie18, []);
const capture19: Capture = new Capture(19, null, specie19, []);
const capture20: Capture = new Capture(20, null, specie20, []);

const sucess1: Sucess = new Sucess("Succès A", "checkmark-circle-outline", "Description du succès A", 25)
const sucess2: Sucess = new Sucess("Succès B", "checkmark-circle-outline", "Description du succès B", 50)


export const SpecieList = [specie1,specie2,specie3,specie4,specie5,specie6];

export const SucessList = [
    new Sucess("Succès A", "checkmark-circle-outline", "Description du succès A", 25),
    new Sucess("Succès B", "checkmark-circle-outline", "Description du succès B", 50),
    new Sucess("Succès C", "checkmark-circle-outline", "Description du succès C", 75),
    new Sucess("Succès D", "checkmark-circle-outline", "Description du succès D", 90),
    new Sucess("Succès E", "checkmark-circle-outline", "Description du succès E", 10),
    new Sucess("Succès F", "checkmark-circle-outline", "Description du succès F", 60),
    new Sucess("Succès G", "checkmark-circle-outline", "Description du succès G", 100),
]
export const UserList = [
    new User(1, 'JohnDoe', 'johndoe@example.com', 'hashedpassword1', new Date('2022-01-01'), [capture1, capture2],[sucess1]),
    new User(2, 'JaneDoe', 'janedoe@example.com', 'hashedpassword2', new Date('2022-02-01'), [capture3],[]),
    new User(3, 'AliceSmith', 'alicesmith@example.com', 'hashedpassword3', new Date('2022-03-01'), [],[sucess2]),
    new User(4, 'BobBrown', 'bobbrown@example.com', 'hashedpassword4', new Date('2022-04-01'), [capture1],[sucess1,sucess2])
];
export const CaptureList = [
    capture1,
    capture2,
    capture3,
    capture4,
    capture5,
    capture6,
    capture7,
    capture8,
    capture9,
    capture10,
    capture11,
    capture12,
    capture13,
    capture14,
    capture15,
    capture16,
    capture17,
    capture18,
    capture19,
    capture20
];

