import {useEffect, useState} from "react";
import Specie from "@/model/domain/Specie";
import {AppFacadeService} from "@/services/AppFacadeService";

export function useGetSpecieByFamily(
    selfId?: string,
    pageSize: number = 10,
) {

    const [isListEnd, setIsListEnd] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore,setIsLoadingMore] = useState(false)
    const [page,setPage] = useState(1)
    const [species, setSpecies] = useState<Specie[]>([]);
    const [error, setError] = useState<unknown>(null);

    const fetchMoreData = () => {
        if(!isListEnd && !isLoadingMore){
            setIsLoadingMore(true)
            setPage(page+1)
        }
    }

    useEffect(() => {
        const fetchCaptures = async () => {
            if(!selfId) return;
            if (isLoading || isListEnd) return;
            if(species.length == 0) setIsLoading(true);
            setError(null);
            try {
                const { speciesRepository } = AppFacadeService.getInstance().dataManager;
                const result = await speciesRepository?.getRelatedSpeciesByFamily(selfId, {
                    index : page,
                    count : pageSize
                });
                if(!result) throw new Error("result undefined")
                setIsListEnd(species.length >= result.total);
                setSpecies((prev) => [...prev, ...result.items]);
            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false);
                setIsLoadingMore(false);
            }
        };
        fetchCaptures();
    }, [page, pageSize]);

    return {
        species,
        isLoading,
        isLoadingMore,
        error,
        isListEnd,
        fetchMoreData,
    };
}