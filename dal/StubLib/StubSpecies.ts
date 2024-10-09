import Specie from "@/model/Specie";

export default class StubSpecies {
    constructor(public Species: Specie[]) {
    }

    createSpecie(newSpecie: Specie) {
        this.Species.push(newSpecie);
    }

    readSpecie(id?: number): Specie | null {
        return this.Species.find(specie => specie.id === id) || null;

    }

    readAllSpecies(page: number = 1, pageSize: number = 10): Specie[] {
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return this.Species.slice(startIndex, endIndex)

    }

    // UPDATE: Update a specie by ID
    updateSpecie(updatedSpecie: Specie) {
        return this.Species.map(specie =>
            specie.id === updatedSpecie.id ? {...specie, ...updatedSpecie} : specie
        );
    }

    // DELETE: Remove a specie by ID
    deleteSpecie(id: number) {
        return this.Species.filter(specie => specie.id !== id);
    }
}
