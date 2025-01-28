
import {ActivityIndicator, Button, FlatList, StyleSheet, View} from "react-native";
import SpeciesSearchBar from "../components/encyclopedia/SpeciesSearchBar";
import CaptureListItem from "@/components/encyclopedia/CaptureListItem";
import { useState} from "react";
import {ThemedView} from "@/components/ui/themed/ThemedView";
import {SafeView} from "@/components/ui/SafeView";
import SpeciesFilterModal from "@/components/encyclopedia/SpeciesFilterModal";
import {ThemedText} from "@/components/ui/themed/ThemedText";
import { useGetCaptures } from "@/hooks/useGetCaptures";

export default function EncyclopediaScreen() {
    const [name,setName] = useState("")
    const {captures=[],isLoading,isLoadingMore,error,isListEnd,refresh,fetchMoreData} = useGetCaptures(20,"")

    return (
        <SafeView>
            <ThemedView style={styles.header}>
                <ThemedView style={styles.searchBar}>
                    <SpeciesSearchBar search={name} setSearch={setName} placeholder={"Rechercher..."}/>
                </ThemedView>
                <SpeciesFilterModal baseSpecies={captures} setFilteredSpecies={()=>{}}/>
            </ThemedView>
            { isLoading ?
                <ActivityIndicator size={"large"}/>
                :
                <FlatList
                    style={styles.capturesList}
                    showsVerticalScrollIndicator={false}
                    columnWrapperStyle={styles.columnWrapper}
                    contentContainerStyle={styles.listContent}
                    data={captures}
                    keyExtractor={capture => capture.id?.toString()}
                    renderItem={({item}) =>
                        <CaptureListItem capture={item}/>
                    }
                    ListEmptyComponent={() => (
                        <View style={styles.empty}>
                            <ThemedText type={"subtitle"}>Aucune espèce trouvée.</ThemedText>
                            <Button title="Raffraîchir" onPress={() => refresh}/>
                        </View>
                    )}
                    ListFooterComponent={()=>(
                        <View style={styles.footer}>
                            {isListEnd && <ThemedText>Pas de capture en plus pour le moment. </ThemedText>}
                            {isLoadingMore && <ActivityIndicator size={"small"} />}
                        </View>
                    )}
                    onEndReachedThreshold={0.2}
                    onEndReached={fetchMoreData}
                    numColumns={3}
                />
            }


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
        flexGrow:1,
    },
    columnWrapper: {
        justifyContent: 'flex-start',
    },
    empty:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
    },
    footer:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10
    }
});
