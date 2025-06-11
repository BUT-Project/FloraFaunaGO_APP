import EncyclopediaScreen from "@/screens/EncyclopediaScreen";
import StubData from "@/dal/StubLib/StubData";
import React from "react";
import {ErrorView} from "@/app/(tabs)/(encyclopedia)/[id]";

export default function Encyclopedia() {

    const { speciesRepository } = StubData.getInstance();
    if (!speciesRepository) {
        return <ErrorView message="Erreur de configuration des repositories" />;
    }
    return (
        <EncyclopediaScreen speciesRepository={speciesRepository}/>
    );
}
