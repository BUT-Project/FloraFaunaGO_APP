import {useEffect, useState} from "react";
import {GenericRepository} from "@/model/service/IGenericRepository";

export function useGetById<T>(
    id: number | undefined,
    repository: GenericRepository<T>
) {
    const [isLoading, setIsLoading] = useState(false);
    const [item, setItem] = useState<T | null>(null);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        // Réinitialiser l'état quand l'ID change ou est invalide
        if (!id || isNaN(id)) {
            setItem(null);
            setError(null);
            return;
        }

        const fetchItem = async () => {
            if (isLoading) return;

            setIsLoading(true);
            setError(null);

            try {
                const result = await repository?.getById(id);
                // Explicitement mettre à null si aucun résultat
                setItem(result || null);
            } catch (err) {
                setError(err);
                setItem(null);  // Réinitialiser l'item en cas d'erreur
            } finally {
                setIsLoading(false);
            }
        };

        fetchItem();
    }, [id, repository]); // Ajouter repository dans les dépendances

    return {
        item,
        isLoading,
        error,
    };
}