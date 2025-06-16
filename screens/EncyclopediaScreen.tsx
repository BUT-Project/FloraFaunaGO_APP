import React, {useState} from "react";
import {ActivityIndicator, Button, FlatList, StyleSheet, View} from "react-native";
import {ThemedText, ThemedView} from "@/components/ui/themed";
import {useInfiniteSpecies} from "@/hooks/viewModels/useInfiniteSpecies";
import {useAuthStore} from "@/context/zustand/store/useAuthStore";
import {SafeView} from "@/components/ui/SafeView";
import {LinearGradient} from "expo-linear-gradient";
import {useThemeColor} from "@/hooks/useThemeColor";
import {ISpeciesRepository} from "@/dal/repository/ISpeciesRepository";
import SpeciesFilterModal from "@/components/encyclopedia/FilterModal";
import {SearchBar, SpecieListItem} from "@/components/encyclopedia";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import Loading from "@/components/ui/Loading";

export const LOADING_TEXT = "Chargement des espèces...";
export const EMPTY_TEXT = "Aucune espèce trouvée";
export const ERROR_TEXT = "Une erreur est survenue lors de la récupération des espèces...";

interface EncyclopediaScreenProps {
    speciesRepository: ISpeciesRepository; // You'll need to inject this
}

export default function EncyclopediaScreen({speciesRepository}: EncyclopediaScreenProps) {
    console.log('📚 EncyclopediaScreen render triggered:', {
        timestamp: new Date().toISOString(),
        repositoryId: speciesRepository?.constructor.name || 'unknown'
    });
    const background = useThemeColor({}, "background");
    const tint = useThemeColor({}, "tint");

    const [searchName, setSearchName] = useState("");
    const userCaptures = useAuthStore((state) => state.user?.captures) ?? [];

     const {
        items: species,
        isLoading,
        isFetching,
        currentKingdomFilter,
        currentClassFilter,
        currentFamilyFilter,
        currentDietFilter,
        toggleKingdomFilter,
        toggleClassFilter,
        toggleFamilyFilter,
        toggleDietFilter,
        sortByName,
        isError,
        search,
        //error,
        hasNextPage,
        fetchNextPage,
        refresh,
        clearFilters,
    } = useInfiniteSpecies(speciesRepository, {
        pageSize: 6, // Same as map for shared caching
        orderBy: 'name',
        descending: false,
        enabled: true,
    });

    const handleSearchChange = (text: string) => {
        setSearchName(text);

        if (text.trim()) {
            search(text.trim());
        } else {
            clearFilters();
        }
    };

    // Handle load more data
    const handleLoadMore = () => {
        console.log('[Encyclopedia] handleLoadMore triggered:', {
            hasNextPage,
            isFetching,
            speciesLength: species.length,
            timestamp: new Date().toISOString()
        });
        if (hasNextPage && !isFetching && species.length > 0) {
            fetchNextPage();
        }
    };

    // Handle refresh
    const handleRefresh = async () => {
        await refresh();
    };

    if (isError) {
        return (<ErrorMessage message={ERROR_TEXT} refresh={handleRefresh} />);
    }
   
    return (
        <SafeView disableBottomInset>
            <LinearGradient
                style={{flex: 1}}
                start={{x: 0, y: 0.75}}
                end={{x: 1, y: 1.3}}
                colors={[background, tint]}
            >
                <ThemedView style={styles.header}>
                    <ThemedView style={styles.searchBar}>
                        <SearchBar
                            search={searchName}
                            setSearch={handleSearchChange} 
                            placeholder={"Rechercher..."}
                        />
                    </ThemedView>
                    <SpeciesFilterModal
                        // Pass current filter states
                        currentKingdomFilter={currentKingdomFilter}
                        currentClassFilter={currentClassFilter}
                        currentFamilyFilter={currentFamilyFilter}
                        currentDietFilter={currentDietFilter}

                        // Pass filter methods
                        toggleKingdomFilter={toggleKingdomFilter}
                        toggleClassFilter={toggleClassFilter}
                        toggleFamilyFilter={toggleFamilyFilter}
                        toggleDietFilter={toggleDietFilter}
                        clearFilters={clearFilters}

                        // Pass sort methods
                        sortByName={sortByName}
                    />
                </ThemedView>

                {isLoading ? 
                    <Loading disableTopInset disableBottomInset text={LOADING_TEXT} />
                 : 
                    <FlatList
                        testID="Encyclopedia.Flatlist"
                        style={styles.capturesList}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContent}
                        data={species}
                        onRefresh={handleRefresh}
                        refreshing={isFetching}
                        keyExtractor={capture => capture.id?.toString()}
                        renderItem={({item}) =>
                            <SpecieListItem specie={item} captureId={(userCaptures?.find((capture)=> capture.specie == item)?.id) ?? null}/>
                        }
                        ListEmptyComponent={() => (
                            <View style={styles.empty}>
                                <ThemedText testID="Empty.Text" type={"subtitle"}>{EMPTY_TEXT}</ThemedText>
                                <Button testID="Refresh" title="Raffraîchir" color={tint} onPress={handleRefresh}/>
                            </View>
                        )}
                        ListFooterComponent={() => (
                            <View style={styles.footer}>
                                {!hasNextPage && species.length > 0 && (
                                    <ThemedText>Pas d'espèces en plus pour le moment.</ThemedText>
                                )}
                                {isFetching && <ActivityIndicator size={"small"}/>}
                            </View>
                        )}
                        onEndReachedThreshold={0.2}
                        onEndReached={handleLoadMore}
                        numColumns={1}
                    />
                }
            </LinearGradient>
        </SafeView>
    );
}

const styles = StyleSheet.create({
    capturesList: {
        flex: 1,
        marginTop: 5,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5,
    },
    searchBar: {
        width: "90%"
    },
    listContent: {
        flexGrow: 1,
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
    footer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10
    },
});
