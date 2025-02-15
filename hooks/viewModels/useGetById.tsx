import {useEffect, useState} from "react";
import StubData from "@/dal/StubLib/StubData";
import Capture from "@/model/domain/Capture";
import {GenericRepository} from "@/model/service/IGenericRepository";

export function useGetById<T>(
  id: number,
  repository: GenericRepository<T>
) {
    const [isLoading, setIsLoading] = useState(false);
    const [item, setCapture] = useState<T | null>(null);
    const [error, setError] = useState<unknown>(null);
    
    useEffect(() => {
        const fetchCapture = async () => {
        if (isLoading) return; 
        setIsLoading(true);
        setError(null);
        try {
            const result = await repository?.getById(id);
            if(result != undefined)
            setCapture(result);
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
        };
        fetchCapture();
    }, [id]); 

    return {
        item,
        isLoading,
        error,
    };
}

