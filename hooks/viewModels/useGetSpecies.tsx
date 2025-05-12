import {useInfiniteQuery} from '@tanstack/react-query';
import StubData from "@/dal/StubLib/StubData";
import Specie from "@/model/domain/Specie";
import {PagedRequest} from "@/shared/PagedRequest";

export function useGetSpecies(
    name: string,
    pageSize: number = 20,
) {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    error
  } = useInfiniteQuery({
    queryKey: ['species2', name, pageSize],
    queryFn: async ({ pageParam = 1 }) => {
      const { speciesRepository } = StubData.getInstance();
      const pageRequest: PagedRequest = {
        index: pageParam,
        count: pageSize,
      };
      const v = await speciesRepository?.getAll(pageRequest);
      console.log("species", v);
      return v;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.items.length < pageSize) {
        return undefined; // No more pages
      }
      return allPages.length + 1;
    },
    initialPageParam: 1,
  });

  // Flatten all pages into a single array of species
  const species = data?.pages.reduce<Specie[]>((acc, page) => {
    if (page?.items) {
      return [...acc, ...page.items];
    }
    return acc;
  }, []) ?? [];

  const fetchMoreData = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return {
    species,
    isLoading,
    isLoadingMore: isFetchingNextPage,
    error,
    isListEnd: !hasNextPage,
    fetchMoreData,
    refresh: refetch,
  };
}