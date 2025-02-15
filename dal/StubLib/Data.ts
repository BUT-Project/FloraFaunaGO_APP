import Habitat from "@/model/domain/Habitat";
import {Diet} from "@/model/domain/Diet";
import {Kingdom} from "@/model/domain/Kingdom";
import {Class} from "@/model/domain/Class";
import {Family} from "@/model/domain/Family";
import Location from "@/model/domain/Location";
import Specie from "@/model/domain/Specie"
import {Climate} from "@/model/domain/Climate";
import User from "@/model/domain/User";
import Capture from "@/model/domain/Capture";
import CaptureDetail from "@/model/domain/CaptureDetail";
import {Success} from "@/model/domain/Success";

const location1: Location = new Location(13.33,19.09,3, 5, 1); // Desert Tchad
const location2: Location = new Location(-2.97,38.92,3, 5, 1);   //Savane Kenya
const location3: Location = new Location(3, 4, 5, 5, 1);
const location4: Location = new Location(3, 4, 5, 5, 1);
const location5: Location = new Location(5, 6, 7, 5, 1);
const location6: Location = new Location(6, 7, 8, 5, 1);
const location7: Location = new Location(48.83, 2.36, 9, 5, 1); //Paris
const location8: Location = new Location(-13.97, 142.52, 10, 5, 1); //Australie (foret d'eucalyptus)
const location9: Location = new Location(66.81, -44.21, 11, 10, 1); //Groenland

const specie1 = new Specie(1, 'Lion', 'Panthera leo', "Le Lion (Panthera leo) est une espèce de mammifères carnivores de la famille des Félidés. La femelle du lion est la lionne, son petit est le lionceau. Le mâle adulte, aisément reconnaissable à son importante crinière, accuse une masse moyenne qui peut être variable selon les zones géographiques où il se trouve, allant de 145 à 180 kg pour les lions d'Asie à plus de 225 kg pour les lions d'Afrique.", new Habitat('jungle', Climate.Tropical), Diet.Carnivores, Kingdom.Animal, Class.Mammals, Family.Felidae, [location1, location2], 'https://upload.wikimedia.org/wikipedia/commons/6/6f/011_The_lion_king_Tryggve_in_the_Serengeti_National_Park_Photo_by_Giles_Laurent.jpg');
const specie2 = new Specie(2, 'Tigre', 'Panthera tigris', 'Le plus grand des félins.', new Habitat('forêt tropicale', Climate.Tropical), Diet.Carnivores, Kingdom.Animal, Class.Mammals, Family.Felidae, [location2], 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?q=80&w=2911&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
const specie3 = new Specie(3, 'Éléphant', 'Loxodonta africana', 'Les éléphants sont les plus grands animaux terrestres.', new Habitat('savane', Climate.Tropical), Diet.Herbivores, Kingdom.Animal, Class.Mammals, Family.Bovids, [location1, location3], 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/African_Bush_Elephant.jpg/1200px-African_Bush_Elephant.jpg');
const specie4 = new Specie(4, 'Zèbre', 'Equus quagga', 'Le zèbre est un mammifère herbivore de la famille des équidés.', new Habitat('savane', Climate.Tropical), Diet.Herbivores, Kingdom.Animal, Class.Mammals, Family.Bovids, [location1, location4], 'https://upload.wikimedia.org/wikipedia/commons/0/0a/Zebra_zoo-leipzig.jpg');
const specie5 = new Specie(5, 'Girafe', 'Giraffa camelopardalis', 'La girafe est le plus grand mammifère terrestre.', new Habitat('savane', Climate.Tropical), Diet.Herbivores, Kingdom.Animal, Class.Mammals, Family.Bovids, [location1, location3], 'https://www.natura-sciences.com/wp-content/uploads/2012/10/Girafe-antiquorum-male.jpg.webp');
const specie6 = new Specie(6, 'Hippopotame', 'Hippopotamus amphibius', 'L\'hippopotame est un grand mammifère semi-aquatique.', new Habitat('rivières', Climate.Tropical), Diet.Herbivores, Kingdom.Animal, Class.Mammals, Family.Bovids, [location2], 'https://toutelathailande.fr/wp-content/uploads/2024/09/Moo-Deng-bebe-hippopotame-nain.jpg');
const specie7 = new Specie(7, 'Rhinocéros', 'Rhinoceros unicornis', 'Le rhinocéros est un mammifère robuste et herbivore.', new Habitat('plaine', Climate.Tropical), Diet.Herbivores, Kingdom.Animal, Class.Mammals, Family.Bovids, [location5, location6], 'https://blog.makila.fr/animaux-safari-afrique/wp-content/gallery/rhinoceros-noir/hooked-lipped-or-black-rhino-at-ongava-etosha-national-park-namibia-photo-dana-allen.jpg');
const specie8 = new Specie(8, 'Guépard', 'Acinonyx jubatus', 'Le mammifère le plus rapide sur terre.', new Habitat('savane', Climate.Tropical), Diet.Carnivores, Kingdom.Animal, Class.Mammals, Family.Felidae, [location1, location2], 'https://www.easytravel.co.tz/wp-content/uploads/2020/09/Adult-Cheetah-Cornering-Savannah-Mara-Kenya.jpg');
const specie9 = new Specie(9, 'Panda géant', 'Ailuropoda melanoleuca', 'Symbole de la conservation de la nature.', new Habitat('forêt de bambous', Climate.Temperate), Diet.Herbivores, Kingdom.Animal, Class.Mammals, Family.Bovids, [location8], 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Grosser_Panda.JPG');
const specie10 = new Specie(10, 'Orang-outan', 'Pongo pygmaeus', 'Un grand singe vivant dans les forêts tropicales.', new Habitat('forêt tropicale', Climate.Tropical), Diet.Omnivores, Kingdom.Animal, Class.Mammals, Family.Bovids, [location9], 'https://www.conservation-nature.fr/wp-content/uploads/2021/02/orang-outan-1.jpg');
const specie11 = new Specie(11, 'Koala', 'Phascolarctos cinereus', "Le koala (Phascolarctos cinereus), appelé aussi Paresseux australien, est une espèce de marsupiaux arboricoles herbivores, endémique d'Australie et le seul représentant encore vivant de la famille des Phascolarctidés. On le trouve dans les régions côtières de l'Australie-Méridionale et orientale, d'Adélaïde à la partie sud de la péninsule du cap York.", new Habitat('forêt d\'eucalyptus', Climate.Temperate), Diet.Herbivores, Kingdom.Animal, Class.Mammals, Family.Phascolarctides, [location8], 'https://d1jyxxz9imt9yb.cloudfront.net/medialib/1594/image/s768x1300/DR_2020-01-18_Koroit-Victoria-AU_Bushfires-MosswoodWildlife-RescuedKoalas_1D_MelanieMahoney_094V1077_reduced.jpg');
const specie12 = new Specie(12, 'Loup gris', 'Canis lupus', 'Un prédateur social vivant en meutes.', new Habitat('forêts et toundras', Climate.Temperate), Diet.Carnivores, Kingdom.Animal, Class.Mammals, Family.Canid, [location7, location8], 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Eurasischer_Wolf_Tiergarten_Worms_2011.JPG/640px-Eurasischer_Wolf_Tiergarten_Worms_2011.JPG');
const specie13 = new Specie(13, 'Manchot empereur', 'Aptenodytes forsteri', 'Un oiseau qui vit en Antarctique.', new Habitat('banquise', Climate.Polar), Diet.Carnivores, Kingdom.Animal, Class.Birds, Family.Spheniscidae, [location9], 'https://media.venturatravel.org/unsafe/800x600/smart/header_media/6acc180a-f1b5-4596-ab62-aaac82624664-emperor-penguin-oceanwide-.jpeg');
const specie14 = new Specie(14, 'Dauphin', 'Delphinus delphis', 'Un mammifère marin très intelligent.', new Habitat('océans', Climate.Temperate), Diet.Carnivores, Kingdom.Animal, Class.Mammals, Family.Delphinidae, [location8, location9], 'https://upload.wikimedia.org/wikipedia/commons/8/87/Tursiops_aduncus%2C_Port_River%2C_Adelaide%2C_Australia_-_2003.jpg');
const specie15 = new Specie(15, 'Aigle royal', 'Aquila chrysaetos', 'Un grand oiseau de proie.', new Habitat('montagnes et vallées', Climate.Temperate), Diet.Carnivores, Kingdom.Animal, Class.Birds, Family.Accipitridae, [location3], 'https://www.ekolien.fr/medias/2022/03/aigle-royal-presentation.jpeg');
const specie16 = new Specie(16, 'Tortue verte', 'Chelonia mydas', 'Une grande tortue marine herbivore.', new Habitat('océans tropicaux', Climate.Tropical), Diet.Herbivores, Kingdom.Animal, Class.Reptiles, Family.Testudines, [location5], 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Hawaii_turtle_2.JPG');
const specie17 = new Specie(17, 'Cobra royal', 'Ophiophagus hannah', 'Le plus grand serpent venimeux.', new Habitat('forêts tropicales', Climate.Tropical), Diet.Carnivores, Kingdom.Animal, Class.Reptiles, Family.Snakes, [location4], 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/King_Cobra_Bangalore.jpg/400px-King_Cobra_Bangalore.jpg');
const specie18 = new Specie(18, 'Fennec', 'Vulpes zerda', 'Un renard du désert avec de grandes oreilles.', new Habitat('déserts', Climate.Dry), Diet.Omnivores, Kingdom.Animal, Class.Mammals, Family.Canid, [location6], 'https://lh4.googleusercontent.com/proxy/bXzKKBP-hrWcn6DRqazBS0e805XC6riVWEQeJVYkO8fUCK8VNOlBXZt9sDJmxBbaE7H9uuZsfDovw6qRvuR48Xx-fKI');
const specie19 = new Specie(19, 'Caméléon panthère', 'Furcifer pardalis', 'Un caméléon coloré de Madagascar.', new Habitat('forêts tropicales', Climate.Tropical), Diet.Insectivores, Kingdom.Animal, Class.Reptiles, Family.Lizards, [location7], 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Panther_chameleon_%28Furcifer_pardalis%29_male_Ambohitantely.jpg/400px-Panther_chameleon_%28Furcifer_pardalis%29_male_Ambohitantely.jpg');
const specie20 = new Specie(20, 'Paon bleu', 'Pavo cristatus', 'Un oiseau célèbre pour son plumage éclatant.', new Habitat('forêts ouvertes', Climate.Tropical), Diet.Omnivores, Kingdom.Animal, Class.Birds, Family.Leporids, [location7], 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Peacock_Plumage.jpg/400px-Peacock_Plumage.jpg');
const specie21 = new Specie(21,'Pigeon','Columba livia','Oiseau commun des villes.',new Habitat('villes', Climate.Temperate),Diet.Omnivores,Kingdom.Animal,Class.Birds,Family.Columbidae,[location7],'https://upload.wikimedia.org/wikipedia/commons/f/f2/Pigeon_%C3%A0_Paris_2007-12-22.jpg');
const specie22 = new Specie(22,'Rat brun','Rattus norvegicus','Rongeur urbain omniprésent.',new Habitat('égouts et bâtiments abandonnés', Climate.Temperate),Diet.Omnivores,Kingdom.Animal,Class.Mammals,Family.Muridae,[location7],'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/WildRat.jpg/800px-WildRat.jpg');
const specie23 = new Specie(23,'Renard roux','Vulpes vulpes','Un prédateur opportuniste dans les villes.',new Habitat('banlieues et parcs', Climate.Temperate),Diet.Omnivores,Kingdom.Animal,Class.Mammals,Family.Canid,[location7],'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Fox-2019.jpg/400px-Fox-2019.jpg');
const specie24 = new Specie(24,'Chauve-souris pipistrelle','Pipistrellus pipistrellus','Chauve-souris commune des villes.',new Habitat('toits et cavités', Climate.Temperate),Diet.Insectivores,Kingdom.Animal, Class.Mammals,Family.Vespertilionidae,[location3, location4],'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Pipistrellus_pipistrellus_on_white.jpg/400px-Pipistrellus_pipistrellus_on_white.jpg');
const specie25 = new Specie(25,'Corneille noire','Corvus corone','Oiseau intelligent et curieux des villes.',new Habitat('parcs et rues', Climate.Temperate),Diet.Omnivores,Kingdom.Animal,Class.Birds,Family.Corvidae,[location7],'https://lemagdesanimaux.ouest-france.fr/images/dossiers/2021-06/mini/corneille-noire-094809-650-400.jpg');
const specie26 = new Specie(26,'Hérisson d\'Europe','Erinaceus europaeus','Mammifère nocturne commun dans les jardins.',new Habitat('jardins', Climate.Temperate),Diet.Insectivores,Kingdom.Animal,Class.Mammals,Family.Erinaceidae,[location7],'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Erinaceus_europaeus_LC0119.jpg/1200px-Erinaceus_europaeus_LC0119.jpg');
const specie27 = new Specie(27,'Abeille européenne','Apis mellifera', 'Insecte pollinisateur essentiel aux écosystèmes et à l\'agriculture.',new Habitat('champs et jardins', Climate.Temperate),Diet.Nectarivores,Kingdom.Animal,Class.Insects,Family.Apididae,[location3, location4],'https://www.leparisien.fr/resizer/65tlPV7WjjSVPpZcKvtzihcOdJs=/932x582/cloudfront-eu-central-1.images.arcpublishing.com/lpguideshopping/VMCRV43ICVBTTNW7S6GXPDQYFI.jpg');
const specie28 = new Specie(28, 'Coccinelle à sept points', 'Coccinella septempunctata', 'Insecte utile qui se nourrit des pucerons, symbole de chance.', new Habitat('champs, jardins et parcs', Climate.Temperate), Diet.Carnivores, Kingdom.Animal, Class.Insects, Family.Coccinellidae, [location3, location5, location7], 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Coccinella_septempunctata_adult_01.jpg/400px-Coccinella_septempunctata_adult_01.jpg');
const specie29 = new Specie(29, 'Pissenlit commun', 'Taraxacum officinale', 'Plante vivace répandue, riche en nectar pour les abeilles.', new Habitat('prairies, bords de routes et jardins', Climate.Temperate), Diet.Autotrophs, Kingdom.Plant, Class.Angiosperms, Family.Asteraceae, [location3, location6, location7], 'https://biodiversite.parc-naturel-normandie-maine.fr/espece/static/medias/717630_3281_Pissenlit_Taraxacum_officinale.jpg');
const specie30 = new Specie(30, 'Chêne pédonculé', 'Quercus robur', 'Arbre robuste, abritant de nombreuses espèces animales et végétales.', new Habitat('forêts tempérées et parcs', Climate.Temperate), Diet.Autotrophs, Kingdom.Plant, Class.Angiosperms, Family.Fagaceae, [location6, location7], 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Quercus_robur.jpg/400px-Quercus_robur.jpg');
const specie31 = new Specie(31, 'Rose trémière', 'Alcea rosea', 'Plante ornementale des jardins, attirant papillons et abeilles.', new Habitat('jardins et bords de murs', Climate.Temperate), Diet.Autotrophs, Kingdom.Plant, Class.Angiosperms, Family.Malvaceae, [location5, location7], 'https://jardinage.lemonde.fr/images/dossiers/historique/roses-tremieres-164828.jpg');
const specie32 = new Specie(32, 'Papillon machaon', 'Papilio machaon', 'Un papillon coloré apprécié dans les prairies et jardins.', new Habitat('prairies fleuries, jardins et parcs', Climate.Temperate), Diet.Nectarivores, Kingdom.Animal, Class.Insects, Family.Papilionidae, [location3, location6], 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Papilio_machaon_-_Glanville_Fritillary.jpg/400px-Papilio_machaon_-_Glanville_Fritillary.jpg');
const specie33 = new Specie(33, 'Hérbe aux chats', 'Nepeta cataria', 'Plante aromatique appréciée des chats et des abeilles.', new Habitat('jardins et friches', Climate.Temperate), Diet.Autotrophs, Kingdom.Plant, Class.Angiosperms, Family.Lamiaceae, [location3, location5, location7], 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Nepeta_cataria_001.jpg/400px-Nepeta_cataria_001.jpg');
const specie34 = new Specie(34, 'Fourmi noire des jardins', 'Lasius niger', 'Une espèce sociale commune dans les sols des jardins.', new Habitat('sols et terriers', Climate.Temperate), Diet.Omnivores, Kingdom.Animal, Class.Insects, Family.Formicidae, [location3, location7], 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Black_Garden_Ant_tending_Citrus_Mealybug_%2815876781048%29.jpg/480px-Black_Garden_Ant_tending_Citrus_Mealybug_%2815876781048%29.jpg');
const specie35 = new Specie(35, 'Érable sycomore', 'Acer pseudoplatanus', 'Arbre résistant utilisé pour l\'ombrage et le bois.', new Habitat('parcs, bords de routes et forêts', Climate.Temperate), Diet.Autotrophs, Kingdom.Plant, Class.Angiosperms, Family.Sapindaceae, [location6, location7], 'https://media.gerbeaud.net/2015/09/640/erable-sycomore-acer.jpg');
const specie36 = new Specie(36, 'Cétoine dorée', 'Cetonia aurata', 'Coléoptère irisé souvent observé sur les fleurs.', new Habitat('prairies et jardins', Climate.Temperate), Diet.Nectarivores, Kingdom.Animal, Class.Insects, Family.Scarabaeidae, [location4, location6], 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Green_beetle_on_flower2.jpg/538px-Green_beetle_on_flower2.jpg');

const captureDetail1: CaptureDetail = new CaptureDetail(1, new Date('2024-01-01'), false, location1);
const captureDetail2: CaptureDetail = new CaptureDetail(2, new Date('2024-02-01'), false, location2);
const captureDetail3: CaptureDetail = new CaptureDetail(3, new Date('2024-02-01'), true, location7);

const capture1: Capture = new Capture(1, 'Lion',specie1,  [captureDetail1, captureDetail2]);
const capture2: Capture = new Capture(2, 'Tigre', specie2,  [captureDetail1]);
const capture3: Capture = new Capture(3,null, specie3, []);
const capture4: Capture = new Capture(4, null, specie4, []);
const capture5: Capture = new Capture(5, null, specie5, []);
const capture6: Capture = new Capture(6, null, specie6, []);
const capture7: Capture = new Capture(7, 'Rhinocéros', specie7, []);
const capture8: Capture = new Capture(8, 'Guépard', specie8, []);
const capture9: Capture = new Capture(9, 'Panda géant', specie9, []);
const capture10 = new Capture(10, null, specie10, []);
const capture11 = new Capture(11, null, specie11, []);
const capture12 = new Capture(12, null, specie12, []);
const capture13 = new Capture(13, null, specie13, []);
const capture14 = new Capture(14, null, specie14, []);
const capture15 = new Capture(15, null, specie15, []);
const capture16 = new Capture(16, null, specie16, []);
const capture17 = new Capture(17, null, specie17, []);
const capture18 = new Capture(18, null, specie18, []);
const capture19 = new Capture(19, null, specie19, []);
const capture20 = new Capture(20, null, specie20, []);
const capture21 = new Capture(21, 'Pigeon', specie21, [captureDetail3]);
const capture22 = new Capture(22, 'Rat brun', specie22, [captureDetail3]);
const capture23 = new Capture(23, 'Renard roux', specie23, []);
const capture24 = new Capture(24, 'Chauve-souris pipistrelle', specie24, []);
const capture25 = new Capture(25, 'Corneille noire', specie25, [captureDetail3]);
const capture26 = new Capture(26, 'Hérisson d\'Europe', specie26, [captureDetail3]);
const capture27 = new Capture(27, null, specie27, []);
const capture28 = new Capture(28, null, specie28, []);
const capture29 = new Capture(29, null, specie29, []);
const capture30 = new Capture(30, null, specie30, []);
const capture31 = new Capture(31, null, specie31, []);
const capture32 = new Capture(32, null, specie32, []);
const capture33 = new Capture(33, null, specie33, []);
const capture34 = new Capture(34, null, specie34, []);
const capture35 = new Capture(35, null, specie35, []);
const capture36 = new Capture(36, null, specie36, []);


const Success1: Success = new Success("Succès A", "checkmark-circle-outline", "Description du succès A", 25)
const Success2: Success = new Success("Succès B", "checkmark-circle-outline", "Description du succès B", 50)


export const SpecieList = [specie1,specie2,specie3,specie4,specie5,specie6];

export const SuccessList = [
    new Success("Maître des Animaux", "paw", "Débloqué en interagissant avec 50 animaux différents.", 25),
    new Success("Pêcheur Expert", "fish", "Attrapez 30 poissons lors de vos aventures.", 50),
    new Success("Chasseur de Trésors", "bug", "Trouvez et collectionnez 20 insectes rares.", 75),
    new Success("Explorateur des Bois", "leaf", "Visitez 10 forêts ou réserves naturelles.", 90),
    new Success("Naturaliste Accompli", "planet", "Complétez toutes les quêtes liées à la nature.", 100),
    new Success("Dompteur d'Oiseaux", "paw", "Interagissez avec 15 espèces d'oiseaux sauvages.", 75),
    new Success("Voyageur Aventurier", "airplane", "Voyagez dans 5 régions différentes.", 90),
    new Success("Guide des Montagnes", "leaf", "Randonnez jusqu'au sommet de 3 montagnes.", 100),
    new Success("Roi de la Forêt", "leaf", "Passez 50 heures à explorer les bois.", 75),
    new Success("Maitre de l'air", "airplane", "Capturez 5 espèces d'oiseaux", 75),
    new Success("Maitre de l'eau", "water", "Capturez 5 espèces marines", 75),
    new Success("Voyageur", "walk", "Parcourez 10km", 75),
];

export const UserList = [
        new User(1, 'JohnDoe', 'johndoe@example.com', 'hashedpassword1', new Date('2022-01-01'), [capture2],[Success1]),
    new User(2, 'JaneDoe', 'janedoe@example.com', 'hashedpassword2', new Date('2022-02-01'), [capture3],[]),
    new User(3, 'AliceSmith', 'alicesmith@example.com', 'hashedpassword3', new Date('2022-03-01'), [],[Success2]),
    new User(4, 'BobBrown', 'bobbrown@example.com', 'hashedpassword4', new Date('2022-04-01'), [capture1],[Success1,Success2])
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
    capture20,
    capture21,
    capture22,
    capture23,
    capture24,
    capture25,
    capture26,
    capture27,
    capture28,
    capture29,
    capture30,
    capture31,
    capture32,
    capture33,
    capture34,
    capture35,
    capture36
];

