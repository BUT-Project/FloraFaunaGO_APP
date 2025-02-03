import {useEffect, useState} from "react";
import StubData from "@/dal/StubLib/StubData";
import Capture from "@/model/domain/Capture";

export function useGetCaptureById(
  id: number,
) {
    const [isLoading, setIsLoading] = useState(false);
    const [capture, setCapture] = useState<Capture | null>(null); 
    const [error, setError] = useState<unknown>(null);
    
    useEffect(() => {
        const fetchCapture = async () => {
        if (isLoading) return; 
        setIsLoading(true);
        setError(null);
        try {
            const { captureRepository } = StubData.getInstance();
            const result = await captureRepository?.getById(id);
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
        capture,
        isLoading,
        error,
    };
}