import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import {GenericRepository} from "@/dal/repository/IGenericRepository";

export function useGetById<T>(
    id: string | null,
    repository: GenericRepository<T> | null,
    options?: Omit<UseQueryOptions<T, Error>, 'queryKey' | 'queryFn'>
) {
    const result = useQuery<T, Error>({
        queryKey: [repository?.constructor.name || 'unknown', 'getById', id],
        queryFn: async () => {
            if (!repository || !id) throw new Error('No repository or ID provided');
            return await repository.getById(id);
        },
        enabled: !!id && !!repository && (options?.enabled !== false),
        retry: false,
        ...options
    });

    return {
        item: result.data || null,
        ...result
    };
}