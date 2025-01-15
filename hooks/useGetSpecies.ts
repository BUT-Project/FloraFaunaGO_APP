import { PagingResult } from "@/dal/StubLib/PagingResult";
import StubData from "@/dal/StubLib/StubData";
import { useEffect, useState } from "react";
import Specie from "@/model/Specie";

interface GetSpeciesProps
 {
    page:number;
    pageSize:number;
}


export function useGetSpecies(page: number = 1, pageSize: number = 10) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<PagingResult<Specie> | null>(null);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const fetchSpecies = async () => {
      setIsLoading(true);
      setError(null); 

      try {
        const { Species } = StubData.getInstance();
        const result = await Species.getAll(page, pageSize);
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false); 
      }
    };

    fetchSpecies();
  }, [page, pageSize]); 

  return {
    data,
    isLoading,
    error,
  };
}