import {ActivityIndicator, Button, FlatList, StyleSheet, useColorScheme, View} from "react-native";
import {SpecieListItem,SearchBar,FilterModal} from "@/components/encyclopedia";
import {useState} from "react";
import {ThemedView, ThemedText} from "@/components/ui/themed";
import {useGetSpecies} from "@/hooks/viewModels/useGetSpecies";
import {useAuthStore} from "@/context/zustand/store/useAuthStore";
import { SafeView } from "@/components/ui/SafeView";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/constants/Colors";

export default function EncyclopediaScreen() {
    const colorScheme = useColorScheme();
    const [name,setName] = useState("")
    const {species=[],isLoading,isLoadingMore,error,isListEnd,refresh,fetchMoreData} = useGetSpecies("")
    const userCaptures = useAuthStore((state) => state.user?.captures);

    if (error) {
        return (
            
        <View style={styles.errorContainer}>
            <ThemedText style={styles.errorText} type="subtitle">
                {error.message || "Impossible de charger les espèces." || "Une erreur s'est produite."}
            </ThemedText>
            {refresh && (
                <Button
                    title="Réessayer"
                    onPress={() => refresh()}
                />
            )}
        </View>
        );
    }
    return (
        <SafeView disableBottomInset>
        <LinearGradient
            style={{ flex: 1 }}
            start={{x: 0, y: 0.5}}
            end={{x: 1, y: 1}}
            colors={[ Colors[(colorScheme ?? 'light') as 'light' | 'dark'].background, 
            Colors[(colorScheme ?? 'light') as 'light' | 'dark'].card]}
            >
            <ThemedView style={styles.header}>
                <ThemedView style={styles.searchBar}>
                    <SearchBar search={name} setSearch={setName} placeholder={"Rechercher..."}/>
                </ThemedView>

                <FilterModal baseSpecies={species} setFilteredSpecies={()=>{}}/>
            </ThemedView>
            { isLoading ?
                <ActivityIndicator size={"large"}/>
                :
                <FlatList
                    style={styles.capturesList}
                    showsVerticalScrollIndicator={false}
                    columnWrapperStyle={styles.columnWrapper}
                    contentContainerStyle={styles.listContent}
                    data={species}
                    onRefresh={() => refresh}
                    refreshing={isLoadingMore}
                    keyExtractor={capture => capture.id?.toString()}
                    renderItem={({item}) =>
                        <SpecieListItem specie={item} captureId={(userCaptures?.find((capture)=> capture.specie == item)?.id) ?? null}/>
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

</LinearGradient>
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
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: 'red',
        marginBottom: 8,
        textAlign: 'center',
    },
});
