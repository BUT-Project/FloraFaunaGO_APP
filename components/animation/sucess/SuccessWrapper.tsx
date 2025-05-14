import { ReactNode } from "react";
import { StyleSheet } from "react-native";
import SuccessPopup from "./SucessPopup";
import { SuccessStore } from "@/context/zustand/strore/useSuccessStore";
import { ThemedView } from "@/components/ui/themed/ThemedView";
type Props = {
    children: ReactNode;
};

export default function SuccessWrapper({children}: Props) { 
    const { isVisibile, message } = SuccessStore();
    return (
        <>
        <ThemedView style={{ flex: 1 }}>
            {children}
            {isVisibile && (
                <ThemedView pointerEvents="box-none">
                    <SuccessPopup message={String(message)} visible={isVisibile} />
                </ThemedView>
            )}
        </ThemedView>
        </>
    )
}