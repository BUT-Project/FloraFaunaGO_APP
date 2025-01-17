import { PagingResult } from "@/dal/StubLib/PagingResult";
import StubData from "@/dal/StubLib/StubData";
import { useEffect, useState } from "react";
import Capture from "@/model/Capture";

interface useGetCapturesProps
 {
    page:number;
    pageSize:number;
}


export function useGetCaptures(page: number = 1, pageSize: number = 20, name:string) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<PagingResult<Capture> | null>(null);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const fetchSpecies = async () => {
      setIsLoading(true);
      setError(null); 

      try {
        const { Capture } = StubData.getInstance();
        const result = await Capture.getAll(page, pageSize);
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