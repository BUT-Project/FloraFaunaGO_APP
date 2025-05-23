import { ReactNode } from "react";
import { SuccessStore } from "@/context/zustand/store/useSuccessStore";
import { ThemedView } from "@/components/ui/themed/ThemedView";
type Props = {
    children: ReactNode;
};

export default function SuccessWrapper({children}: Props) { 
    return (
        <> 
        <ThemedView style={{ flex: 1 }}>
            {children}
        </ThemedView>
        </>
    )
}