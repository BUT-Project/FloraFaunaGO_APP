import {ActivityIndicator, Button, FlatList, StyleSheet, View} from "react-native";
import {SpecieListItem,SearchBar,FilterModal} from "@/components/encyclopedia";
import {useState} from "react";
import {ThemedText, ThemedView} from "@/components/ui/themed";
import {useGetSpecies} from "@/hooks/viewModels/useGetSpecies";
import {useAuthStore} from "@/context/zustand/store/useAuthStore";
import { SafeView } from "@/components/ui/SafeView";
import { LinearGradient } from "expo-linear-gradient";
import { useThemeColor } from "@/hooks/useThemeColor";
export default function EncyclopediaScreen() {
    const background = useThemeColor({},"background");
    const tint = useThemeColor({},"tint");

    const [name,setName] = useState("")
    const {species=[],isLoading,isLoadingMore,error,isListEnd,refresh,fetchMoreData} = useGetSpecies("")
    const userCaptures = useAuthStore((state) => state.user?.captures) ?? [];
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
            start={{x: 0, y: 0.75}}
            end={{x: 1, y: 1.3}}
            colors={[background,tint]}
        >
            <ThemedView style={styles.header}>
                <ThemedView style={styles.searchBar}>
                    <SearchBar search={name} setSearch={setName} placeholder={"Rechercher..."}/>
                </ThemedView>
                <FilterModal baseSpecies={species} setFilteredSpecies={()=>{}}/>
            </ThemedView>
            { isLoading ?
                <ActivityIndicator testID="Loading" size={"large"}/>
                :
                <FlatList
                    testID="Encyclopedia.Flatlist"
                    style={styles.capturesList}
                    showsVerticalScrollIndicator={false}
                    columnWrapperStyle={styles.columnWrapper}
                    contentContainerStyle={styles.listContent}
                    data={species}
                    onRefresh={() => refresh()}
                    refreshing={isLoadingMore}
                    keyExtractor={capture => capture.id?.toString()}
                    renderItem={({item}) =>
                        <SpecieListItem specie={item} captureId={(userCaptures?.find((capture)=> capture.specie == item)?.id) ?? null}/>
                    }
                    ListEmptyComponent={() => (
                        <View style={styles.empty}>
                            <ThemedText type={"subtitle"}>Aucune espèce trouvée.</ThemedText>
                            <Button testID="Refresh" title="Raffraîchir" onPress={() => refresh()}/>
                        </View>
                    )}
                    ListFooterComponent={()=>(
                        <View style={styles.footer}>
                            {isListEnd && <ThemedText>Pas d'espèces en plus pour le moment. </ThemedText>}
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
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5,
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
