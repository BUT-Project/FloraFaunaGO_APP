import {useLocalSearchParams} from "expo-router";
import SuccessDetailScreen from "@/screens/SuccessDetailScreen";
import StubData from "@/dal/StubLib/StubData";
import {ThemedView} from "@/components/ui/themed/ThemedView";
import React, {useEffect, useState} from "react";
import {ActivityIndicator} from "react-native";
import {Sucess} from "@/model/Sucess";
import {ThemedText} from "@/components/ui/themed/ThemedText";

export default  function details() {
    const {id} = useLocalSearchParams();
    const [sucess, setSucess] = useState<Sucess | null>(null); // État pour stocker les données
    const [loading, setLoading] = useState(true); // État de chargement

    useEffect(() => {
        async function fetchSuccess() {
            try {
                const success = StubData.getInstance().Sucess;
                const result = await success.getById(id as string);
                setSucess(result); // Mettre à jour les données une fois chargées
            } catch (error) {
                console.error("Erreur lors du chargement du succès :", error);
            } finally {
                setLoading(false); // Arrêter le chargement
            }
        }
        fetchSuccess();
    }, [id]);

    if (loading) {
        return (
            <ThemedView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </ThemedView>
        );
    }

    if (!sucess) {
        return (
            <ThemedView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ThemedText>Erreur : Aucun succès trouvé.</ThemedText>
            </ThemedView>
        );
    }
    return (
        <SuccessDetailScreen sucess={sucess}/>
    )

}