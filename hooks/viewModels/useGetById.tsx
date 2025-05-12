import {useEffect, useState} from "react";
import {GenericRepository} from "@/dal/repository/IGenericRepository";

export function useGetById<T>(
    id: number | undefined,
    repository: GenericRepository<T> | null
) {
    const [isLoading, setIsLoading] = useState(false);
    const [item, setItem] = useState<T | null>(null);
    const [error, setError] = useState<Error|null>(null);

    useEffect(() => {
        // Reset state if ID is invalid or repository is null
        if (!id || isNaN(id) || !repository) {
            setItem(null);
            setError(null);
            setIsLoading(false);
            return;
        }

        const fetchItem = async () => {
            // Prevent concurrent fetches
            if (isLoading) return;

            setIsLoading(true);
            setError(null);

            try {
                const result = await repository?.getById(id);
                // Using nullish coalescing for explicit null check
                setItem(result || null);
            } catch (err) {
                // @ts-ignore
                setError(err);
                setItem(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchItem();
    }, [id, repository]);

    return {
        item,
        isLoading,
        error,
    };
}