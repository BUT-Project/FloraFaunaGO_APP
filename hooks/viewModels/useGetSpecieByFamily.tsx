import { useInfiniteQuery } from "@tanstack/react-query";
import { Specie, Family } from "@/model/domain";
import { AppFacadeService } from "@/services/AppFacadeService";

export function useGetSpecieByFamily(
  selfId: string,
  family: Family,
  pageSize: number = 10
) {
    const { speciesRepository } = AppFacadeService.getInstance().dataManager;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: ["related-species", selfId, family],
    enabled: !!speciesRepository,
    initialPageParam:0,
    queryFn: async ({ pageParam = 0}) => {
      const result = await speciesRepository?.getRelatedSpeciesByFamily(
        selfId,
        family,
        {
          index: pageParam,
          count: pageSize,
        }
      );
      if (!result) throw new Error("No result");
      return result;
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.flatMap((p) => p.items).length;
      if (totalLoaded < lastPage.total) {
        return allPages.length + 1; // page suivante
      } else {
        return undefined; // fin de liste
      }
    },
  });

  const species = data?.pages.flatMap((page) => page.items) ?? [];

  return {
    species,
    isLoading: isFetching && !data,
    isLoadingMore: isFetchingNextPage,
    error,
    isListEnd: !hasNextPage,
    fetchMoreData: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  };
}
