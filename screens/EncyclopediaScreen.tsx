
import {FlatList, StyleSheet} from "react-native";
import CaptureSearchBar from "../components/encyclopedia/CaptureSearchBar";
import SpeciesListItem from "@/components/encyclopedia/CapturesListItem";
import { useState} from "react";
import {ThemedView} from "@/components/ui/themed/ThemedView";
import CapturesFilterModal from "@/components/encyclopedia/CapturesFilterModal";
import {SafeView} from "@/components/ui/SafeView";
import Capture from "@/model/Capture";

interface EncyclopediaScreenProps {
    captures: Capture[]
}

export default function EncyclopediaScreen(props: EncyclopediaScreenProps) {
    const [filteredData, setFilteredData] = useState(props.captures);

    return (
        <SafeView>

            <ThemedView style={styles.header}>
                <ThemedView style={styles.searchBar}>
                    <CaptureSearchBar baseData={props.captures} setFilteredData={setFilteredData} placeholder={"Rechercher..."}/>
                </ThemedView>
                <CapturesFilterModal baseSpecies={props.captures} setFilteredSpecies={setFilteredData}/>
            </ThemedView>

            <FlatList
                style={styles.capturesList}
                showsVerticalScrollIndicator={false}
                columnWrapperStyle={styles.columnWrapper}
                contentContainerStyle={styles.listContent}
                data={filteredData}
                keyExtractor={capture => String(capture.id)}
                renderItem={(capture) => <SpeciesListItem capture={capture.item}/>}
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
