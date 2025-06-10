import {ActivityIndicator, Button, FlatList, StyleSheet, View} from "react-native";
import {SpecieListItem,SearchBar,FilterModal} from "@/components/encyclopedia";
import {useState} from "react";
import {ThemedText, ThemedView} from "@/components/ui/themed";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import {useGetSpecies} from "@/hooks/viewModels/useGetSpecies";
import {useAuthStore} from "@/context/zustand/store/useAuthStore";
import { LinearGradient } from "expo-linear-gradient";
import { useThemeColor } from "@/hooks/useThemeColor";
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
               <ErrorMessage message="Une erreur est survenue lors de la récupération des espèces..." refresh={refresh} />
                :
                <>
                { isLoading ?
                    <Loading disableTopInset disableBottomInset text="Chargement des espèces..." />
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
                                <ThemedText type={"subtitle"}>Aucune espèce trouvée</ThemedText>
                                <Button testID="Refresh" title="Raffraîchir" color={tint} onPress={() => refresh()}/>
                            </View>
                        )}
                        ListFooterComponent={()=>
                            species.length > 0 ?
                                <View style={styles.footer}>
                                    {isListEnd && <ThemedText>Pas d'espèces en plus pour le moment. </ThemedText>}
                                    {isLoadingMore && <ActivityIndicator size={"small"} />}
                                </View>
                            :
                            null
                        }
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
        gap: 10,
        justifyContent:"center",
        alignItems:"center",
    },
    footer:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10
    },
});
