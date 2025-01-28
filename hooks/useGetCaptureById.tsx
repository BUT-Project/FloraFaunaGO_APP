import { useState, useEffect, useCallback } from "react";
import StubData from "@/dal/StubLib/StubData";
import Capture from "@/model/Capture";

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
            const { Capture } = StubData.getInstance();
            const result = await Capture.getById(id);
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