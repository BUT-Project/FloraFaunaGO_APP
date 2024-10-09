import {Sucess} from "@/model/Sucess";
import Capture from "@/model/Capture";

export default class StubSucess {
    constructor(public Sucesses: Sucess[]) {
    }
     createSuccess(newSuccess: Sucess) {
        this.Sucesses.push(newSuccess);
    }

    // READ: Obtenir une instance de Success par index
     readSuccess(nom?: string): Sucess | null {
        return this.Sucesses.find(suc => suc.nom == nom) || null;
    }

    // READ: Obtenir tous les succès avec pagination
     readAllSuccesses(page: number = 1, pageSize: number = 10): Sucess[]  {
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return this.Sucesses.slice(startIndex, endIndex)

    }


     updateSuccess(updatedSuccess: Sucess) {
        return this.Sucesses.map(sucess =>
            sucess.nom === updatedSuccess.nom ? { ...sucess, ...updatedSuccess } : Sucess
        );
    }

    // DELETE: Supprimer une instance de Success par index
     deleteSuccess(index: string) {
        return this.Sucesses.filter(sucess => sucess.nom !== index);
    }
}
