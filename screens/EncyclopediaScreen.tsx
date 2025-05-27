import {ActivityIndicator, Button, FlatList, StyleSheet, View} from "react-native";
import {SearchBar, SpecieListItem} from "@/components/encyclopedia";
import {useState} from "react";
import {ThemedText, ThemedView} from "@/components/ui/themed";
import {useInfiniteSpecies} from "@/hooks/viewModels/useInfiniteSpecies";
import {useAuthStore} from "@/context/zustand/store/useAuthStore";
import {SafeView} from "@/components/ui/SafeView";
import {LinearGradient} from "expo-linear-gradient";
import {useThemeColor} from "@/hooks/useThemeColor";
import {ISpeciesRepository} from "@/dal/repository/ISpeciesRepository";
import SpeciesFilterModal from "@/components/encyclopedia/FilterModal";

interface EncyclopediaScreenProps {
    speciesRepository: ISpeciesRepository; // You'll need to inject this
}

export default function EncyclopediaScreen({speciesRepository}: EncyclopediaScreenProps) {
    const background = useThemeColor({}, "background");
    const tint = useThemeColor({}, "tint");

    const [searchName, setSearchName] = useState("");
    const userCaptures = useAuthStore((state) => state.user?.captures) ?? [];

    // Use the infinite species hook
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
        error,
        hasNextPage,
        fetchNextPage,
        refresh,
        clearFilters,
    } = useInfiniteSpecies(speciesRepository, {
        pageSize: 30, // 3 columns × 10 rows
        orderBy: 'name',
        descending: false,
        enabled: true
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
        if (hasNextPage && !isFetching) {
            fetchNextPage();
        }
    };

    // Handle refresh
    const handleRefresh = async () => {
        await refresh();
    };

    if (isError) {
        return (
            <View style={styles.errorContainer}>
                <ThemedText style={styles.errorText} type="subtitle">
                    {error?.message || "Impossible de charger les espèces." || "Une erreur s'est produite."}
                </ThemedText>
                <Button
                    title="Réessayer"
                    onPress={handleRefresh}
                />
            </View>
        );
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
                            setSearch={handleSearchChange} // 🔧 Use the new handler
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

                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size={"large"}/>
                        <ThemedText style={styles.loadingText}>Chargement des espèces...</ThemedText>
                    </View>
                ) : (
                    <FlatList
                        style={styles.capturesList}
                        showsVerticalScrollIndicator={false}
                        columnWrapperStyle={styles.columnWrapper}
                        contentContainerStyle={styles.listContent}
                        data={species}
                        onRefresh={handleRefresh}
                        refreshing={isFetching}
                        keyExtractor={capture => capture.id?.toString()}
                        renderItem={({item}) => (
                            <SpecieListItem
                                specie={item}
                                captureId={
                                    (userCaptures?.find((capture) => capture.specie == item)?.id) ?? null
                                }
                            />
                        )}
                        ListEmptyComponent={() => (
                            <View style={styles.empty}>
                                <ThemedText type={"subtitle"}>
                                    {searchName ? "Aucune espèce trouvée pour cette recherche." : "Aucune espèce trouvée."}
                                </ThemedText>
                                <Button title="Raffraîchir" onPress={handleRefresh}/>
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
                        numColumns={3}
                    />
                )}
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
    empty: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    footer: {
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
    },
});