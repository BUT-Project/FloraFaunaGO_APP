
import {ActivityIndicator, Button, FlatList, StyleSheet, View} from "react-native";
import SpeciesSearchBar from "../components/encyclopedia/SpeciesSearchBar";
import CaptureListItem from "@/components/encyclopedia/CaptureListItem";
import { useState} from "react";
import {ThemedView} from "@/components/ui/themed/ThemedView";
import {SafeView} from "@/components/ui/SafeView";
import Capture from "@/model/Capture";
import SpeciesFilterModal from "@/components/encyclopedia/SpeciesFilterModal";
import {ThemedText} from "@/components/ui/themed/ThemedText";
import { useGetCaptures } from "@/hooks/useGetCaptures";
interface EncyclopediaScreenProps {
    captures: Capture[]
}

export default function EncyclopediaScreen(props: EncyclopediaScreenProps) {
    const [name,setName] = useState("")
    const [page,setPage] = useState(1)
    const {captures,isLoading,error,isListEnd,refresh} = useGetCaptures(page,20,"")
    console.log(captures)

    const fetchMoreData = () => {
        if(!isListEnd){
            setPage(page+1)
        }
    }

    return (
        <SafeView>
            <ThemedView style={styles.header}>
                <ThemedView style={styles.searchBar}>
                    <SpeciesSearchBar search={name} setSearch={setName} placeholder={"Rechercher..."}/>
                </ThemedView>
                <SpeciesFilterModal baseSpecies={props.captures} setFilteredSpecies={()=>{}}/>
            </ThemedView>
            { isLoading && 
                <ActivityIndicator  size={"large"}/>
            }
            <FlatList
                style={styles.capturesList}
                showsVerticalScrollIndicator={false}
                columnWrapperStyle={styles.columnWrapper}
                contentContainerStyle={styles.listContent}
                data={captures || []}
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
                    </View>
                )}
                onEndReachedThreshold={0.2}
                onEndReached={fetchMoreData}
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
        flexGrow:1,
        padding: 5,
    },
    columnWrapper: {
        justifyContent: 'space-between',
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
