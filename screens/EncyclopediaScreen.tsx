
import {FlatList, StyleSheet, TouchableOpacity} from "react-native";
import SpeciesSearchBar from "../components/encyclopedia/SpeciesSearchBar";
import SpeciesListItem from "@/components/encyclopedia/SpeciesListItem";
import { useState} from "react";
import {ThemedView} from "@/components/ui/themed/ThemedView";
import {SafeView} from "@/components/ui/SafeView";
import Capture from "@/model/Capture";
import SpeciesFilterModal from "@/components/encyclopedia/SpeciesFilterModal";
import {Link, useRouter} from "expo-router";

interface EncyclopediaScreenProps {
    captures: Capture[]
}

export default function EncyclopediaScreen(props: EncyclopediaScreenProps) {
    const [filteredData, setFilteredData] = useState(props.captures);
    const router = useRouter()
    return (
        <SafeView>

            <ThemedView style={styles.header}>
                <ThemedView style={styles.searchBar}>
                    <SpeciesSearchBar baseData={props.captures} setFilteredData={setFilteredData} placeholder={"Rechercher..."}/>
                </ThemedView>
                <SpeciesFilterModal baseSpecies={props.captures} setFilteredSpecies={setFilteredData}/>
            </ThemedView>

            <FlatList
                style={styles.capturesList}
                showsVerticalScrollIndicator={false}
                columnWrapperStyle={styles.columnWrapper}
                contentContainerStyle={styles.listContent}
                data={filteredData}
                keyExtractor={capture => String(capture.id)}
                renderItem={(capture) =>
                    <SpeciesListItem capture={capture.item} key={capture.item.id}/>
                }
                numColumns={3}
            />
        </SafeView>
    )
}

const styles = StyleSheet.create({
    capturesList:{
        flex: 1,
        marginTop: 5,
    },
    header:{
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
    },
    searchBar:{
        width:"90%"
    },
    listContent: {
        padding: 5,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    }
});
