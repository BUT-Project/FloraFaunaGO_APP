export class Sucess{
    private _nom: string;
    private _image: string;
    private _avancement: number;
    private _description: string;

    // Constructeur
    public constructor(nom: string, image: string, description: string, avancement: number) {
        this._nom = nom;
        this._image = image;
        this._description = description;
        this._avancement = avancement;
    }

    // Getters
    public get nom(): string {
        return this._nom;
    }

    public get image(): string {
        return this._image;
    }

    public get avancement(): number {
        return this._avancement;
    }

    public get description(): string {
        return this._description;
    }

}