import {useCallback, useEffect, useState} from "react";
import StubData from "@/dal/StubLib/StubData";
import Capture from "@/model/domain/Capture";
import {PagedRequest} from "@/shared/PagedRequest";

export function useGetCaptures(
  pageSize: number = 20,
  name: string
) {
  const [isListEnd, setIsListEnd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore,setIsLoadingMore] = useState(false)
  const [page,setPage] = useState(1)
  const [captures, setCaptures] = useState<Capture[]>([]); 
  const [error, setError] = useState<unknown>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const fetchMoreData = () => {
      if(!isListEnd && !isLoadingMore){
        setIsLoadingMore(true)
        setPage(page+1)
      }
  }
  
  useEffect(() => {
    const fetchSpecies = async () => {
      if (isLoading || isListEnd) return; 
      if(captures.length == 0)
        setIsLoading(true);
      setError(null);
      try {
        const { captureRepository } = StubData.getInstance();
        const pageRequest: PagedRequest = {
            index: page,
            count: pageSize,
        }
        const result = await captureRepository?.getAll(pageRequest);
        console.log(result)
        if(result != undefined){
          setIsListEnd(captures.length >= result?.total);
          setCaptures((prev) => [...prev, ...result.items]);
        }
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    };

    fetchSpecies();
  }, [page, pageSize, refreshTrigger]); 

  return {
    captures,
    isLoading,
    isLoadingMore,
    error,
    isListEnd,
    fetchMoreData,
    refresh,
  };
}