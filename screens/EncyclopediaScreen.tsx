
import {FlatList, StyleSheet} from "react-native";
import SearchBar from "../components/ui/SearchBar";
import SpeciesListItem from "@/components/encyclopedia/SpeciesListItem";
import { useState} from "react";
import {ThemedView} from "@/components/ui/themed/ThemedView";
import SpeciesFilter from "@/components/encyclopedia/SpeciesFilter";
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
                    <SearchBar baseData={props.captures} setFilteredData={setFilteredData} placeholder={"Rechercher..."}/>
                </ThemedView>

                <SpeciesFilter baseSpecies={props.captures} setFilteredSpecies={setFilteredData}/>
            </ThemedView>

            <FlatList
                style={styles.speciesList}
                showsVerticalScrollIndicator={false}
                columnWrapperStyle={styles.columnWrapper}
                contentContainerStyle={styles.listContent}
                data={filteredData}
                keyExtractor={specie => String(specie.id)}
                renderItem={(specie) => <SpeciesListItem specie={specie.item}/>}
                numColumns={3}

            />
        </SafeView>
    )
}

const styles = StyleSheet.create({
    speciesList:{
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
