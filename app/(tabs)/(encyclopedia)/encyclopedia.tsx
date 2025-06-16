import React from "react";
import { SafeView } from "@/components/ui/SafeView";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import ErrorBoundary from "@/components/ErrorBoundary";
import EncyclopediaScreen from "@/screens/EncyclopediaScreen";
import {AppFacadeService} from "@/services/AppFacadeService";


export default function Encyclopedia() {

    const { speciesRepository } = AppFacadeService.getInstance().dataManager;
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
