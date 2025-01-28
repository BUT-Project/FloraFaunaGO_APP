import {useCallback, useEffect, useState} from "react";
import StubData from "@/dal/StubLib/StubData";
import Capture from "@/model/domain/Capture";
import {Family} from "@/model/domain/Family";

export function useGetCaptureByFamily(
  family: Family | undefined,
  selfId?: number,
  pageSize: number = 10,
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
        const fetchCaptures = async () => {
            if(!family) return;
            if (isLoading || isListEnd) return; 
            if(captures.length == 0) setIsLoading(true);
            setError(null);
            try {
                const { captureRepository } = StubData.getInstance();
                const result = await captureRepository?.getByFamily(family, page, pageSize);
                if(result != undefined){
                setIsListEnd(captures.length >= result.total);
                setCaptures((prev) => [...prev, ...result.items]);
                }
            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false);
                setIsLoadingMore(false);
            }
        };

        fetchCaptures();
    }, [family, page, pageSize, refreshTrigger]); 
    
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