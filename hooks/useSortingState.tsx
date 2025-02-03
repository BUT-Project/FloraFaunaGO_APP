import {useState} from "react";

export function useSortingState(initialProperty?: string | null, initialDescending?: boolean | null) {
    const [orderingPropertyName, setOrderingProperty] = useState<string | null>(initialProperty ?? null);
    const [descending, setDescending] = useState<boolean>(initialDescending ?? false);

    const toggleSort = (propertyName: string) => {
        if (orderingPropertyName === propertyName) {
            setDescending(!descending);
        } else {
            setOrderingProperty(propertyName);
            setDescending(false);
        }
    };

    return {
        orderingPropertyName,
        descending,
        toggleSort,
        setOrderingProperty,
        setDescending
    };
}