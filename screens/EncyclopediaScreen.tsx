import {ActivityIndicator, Button, FlatList, StyleSheet, View,ScrollView} from "react-native";
import {SpecieListItem,SearchBar,FilterModal} from "@/components/encyclopedia";
import {useState} from "react";
import {ThemedText, ThemedView} from "@/components/ui/themed";
import {useGetSpecies} from "@/hooks/viewModels/useGetSpecies";
import {useAuthStore} from "@/context/zustand/store/useAuthStore";
import { LinearGradient } from "expo-linear-gradient";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import Loading from "@/components/ui/Loading";

export default function EncyclopediaScreen() {
    const background = useThemeColor({},"background");
    const tint = useThemeColor({},"tint");

    const [name,setName] = useState("")
    const {species=[],isLoading,isLoadingMore,error,isListEnd,refresh,fetchMoreData} = useGetSpecies("")
    const userCaptures = useAuthStore((state) => state.user?.captures) ?? [];
    return (
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
            {error ? 
                <ThemedView style={styles.errorContainer}>
                    <Ionicons name="warning-outline" size={64} color="red"/>
                    <ThemedText type="subtitle">
                        Erreur lors de la récupération des espèces :
                    </ThemedText>
                    <ScrollView style={styles.scroll}> 
                        <ThemedText style={styles.errorText}>
                            {error.message || "Impossible de charger les espèces." || "Une erreur s'est produite."}
                        </ThemedText>
                    </ScrollView>
                    {refresh && (
                        <Button title="Réessayer" onPress={() => refresh()} color={tint}/>
                    )}
                </ThemedView>
                :
                <>
                { isLoading ?
                    <Loading disableTopInset disableBottomInset text="Chargement des espèces..."/>
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
                </>
            }
    </LinearGradient>
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
        gap:20,
    },
    errorText: {
        color: 'red',
    },
    scroll:{
        maxHeight: "70%",
        flexShrink:1,
    }
});
