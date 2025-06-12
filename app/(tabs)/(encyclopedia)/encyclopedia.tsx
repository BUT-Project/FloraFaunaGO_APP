import StubData from "@/dal/StubLib/StubData";
import React from "react";
import { SafeView } from "@/components/ui/SafeView";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import ErrorBoundary from "@/components/ErrorBoundary";
import EncyclopediaScreen from "@/screens/EncyclopediaScreen";


export default function Encyclopedia() {

    const { speciesRepository } = StubData.getInstance();
    if (!speciesRepository) {
        return <ErrorMessage message="Erreur de configuration des repositories" />;
    }
    return (
        <ErrorBoundary page="Encyclopedie">
            <SafeView disableBottomInset>
                <EncyclopediaScreen speciesRepository={speciesRepository}/>
            </SafeView>
        </ErrorBoundary>
    );
}
