export class Success {
    private nom: string
    private image: string
    private avancement: number
    private description: string
    private event : string

    public constructor(nom: string, image: string, description: string, avancement: number,event?:string) {
        this.nom = nom
        this.image = image
        this.description = description
        this.avancement = avancement
        this.event = event
    }

}

    export const SuccessList = [
      new Success("Photographe Amateur", "camera", "Capturez votre première photo.", 10, "unlockPhotographeAmateur"),
      new Success("Maître des Animaux", "paw", "Débloqué en interagissant avec 50 animaux différents.", 25, "unlockMaîtreDesAnimaux"),
      new Success("Pêcheur Expert", "fish", "Attrapez 30 poissons lors de vos aventures.", 50, "unlockPêcheurExpert"),
      new Success("Chasseur de Trésors", "bug", "Trouvez et collectionnez 20 insectes rares.", 75, "unlockChasseurDeTrésors"),
      new Success("Explorateur des Bois", "leaf", "Visitez 10 forêts ou réserves naturelles.", 90, "unlockExplorateurDesBois"),
      new Success("Naturaliste Accompli", "planet", "Complétez toutes les quêtes liées à la nature.", 100, "unlockNaturalisteAccompli"),
      new Success("Dompteur d'Oiseaux", "paw", "Interagissez avec 15 espèces d'oiseaux sauvages.", 75, "unlockDompteurDOiseaux"),
      new Success("Voyageur Aventurier", "airplane", "Voyagez dans 5 régions différentes.", 90, "unlockVoyageurAventurier"),
      new Success("Guide des Montagnes", "leaf", "Randonnez jusqu'au sommet de 3 montagnes.", 100, "unlockGuideDesMontagnes"),
      new Success("Roi de la Forêt", "leaf", "Passez 50 heures à explorer les bois.", 75, "unlockRoiDeLaForet"),
      new Success("Maitre de l'air", "airplane", "Capturez 5 espèces d'oiseaux.", 75, "unlockMaitreDeLair"),
      new Success("Maitre de l'eau", "water", "Capturez 5 espèces marines.", 75, "unlockMaitreDeLeau"),
      new Success("Voyageur", "walk", "Parcourez 10km.", 75, "unlockVoyageur"),
    ];


