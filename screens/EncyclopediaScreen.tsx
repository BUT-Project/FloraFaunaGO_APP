
import {FlatList, StyleSheet, TextInput, TouchableOpacity} from "react-native";
import SearchBar from "../components/ui/SearchBar";
import {Specie} from "@/app/(tabs)/encyclopedia";
import SpeciesListItem from "@/components/encyclopedia/SpeciesListItem";
import {SafeAreaView} from "react-native-safe-area-context";
import {SetStateAction, useState} from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import {ThemedView} from "@/components/ui/themed/ThemedView";
import SpeciesFilter from "@/components/encyclopedia/SpeciesFilter";

interface EncyclopediaScreenProps {
    species: Specie[]
}

export default function EncyclopediaScreen(props: EncyclopediaScreenProps) {
    const [filteredData, setFilteredData] = useState(props.species);

    return (
        <SafeAreaView style={{flex:1}}>
            <ThemedView style={styles.header}>
                <ThemedView style={styles.searchBar}>
                    <SearchBar baseData={props.species} setFilteredData={setFilteredData} placeholder={"Rechercher..."}/>
                </ThemedView>
                <SpeciesFilter baseSpecies={props.species} setFilteredSpecies={setFilteredData}/>
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
        </SafeAreaView>
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
