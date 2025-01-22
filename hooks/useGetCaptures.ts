import { useState, useEffect, useCallback } from "react";
import StubData from "@/dal/StubLib/StubData";
import { PagingResult } from "@/dal/StubLib/PagingResult";
import Capture from "@/model/Capture";


export function useGetCaptures(
  page: number = 1,
  pageSize: number = 20,
  name: string
) {
  const [isListEnd, setIsListEnd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [captures, setCaptures] = useState<Capture[]>([]); 

  const [error, setError] = useState<unknown>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const fetchSpecies = async () => {
      if (isLoading || isListEnd) return; 

      setIsLoading(true);
      setError(null);
      try {
        const { Capture } = StubData.getInstance();
        const result = await Capture.getAll(page, pageSize);
        setIsListEnd(result && result.count * result.index >= result.total);
        setCaptures((prev) => [...prev, ...result.items]);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpecies();
  }, [page, pageSize, refreshTrigger]); 

  return {
    captures,
    isLoading,
    error,
    isListEnd,
    refresh,
  };
}