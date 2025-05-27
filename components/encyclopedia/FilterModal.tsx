import React, {useState} from 'react';
import {Modal, StyleSheet, TouchableOpacity} from 'react-native';
import {ThemedIcon, ThemedText, ThemedView} from "@/components/ui/themed";
import {Class, Diet, Family, Kingdom,} from "@/model/domain";
import {FilterEnumSelector} from './FilterSelector';
import {useThemeColor} from '@/hooks/useThemeColor';

type SpeciesFilterProps = {
    // Filter state from useInfiniteSpecies
    currentKingdomFilter: Kingdom | null;
    currentClassFilter: Class | null;
    currentFamilyFilter: Family | null;
    currentDietFilter: Diet | null;

    // Filter methods from useInfiniteSpecies
    toggleKingdomFilter: (kingdom: Kingdom) => void;
    toggleClassFilter: (classType: Class) => void;
    toggleFamilyFilter: (family: Family) => void;
    toggleDietFilter: (diet: Diet) => void;
    clearFilters: () => void;

    // Sort methods from useInfiniteSpecies
    sortByName: (descending?: boolean) => void;
}

export default function SpeciesFilterModal(props: SpeciesFilterProps) {
    const selectedBackground = useThemeColor({}, "tint");
    const [visible, setVisible] = useState(false);

    // Use the current filter states from the hook
    const {
        currentKingdomFilter,
        currentClassFilter,
        currentFamilyFilter,
        currentDietFilter,
        toggleKingdomFilter,
        toggleClassFilter,
        toggleFamilyFilter,
        toggleDietFilter,
        clearFilters,
        sortByName
    } = props;

    const onKingdomChange = (newKingdom: Kingdom) => {
        toggleKingdomFilter(newKingdom);
    }

    const onClassChange = (newClass: Class) => {
        toggleClassFilter(newClass);
    }

    const onFamilyChange = (newFamily: Family) => {
        toggleFamilyFilter(newFamily);
    }

    const onDietChange = (newDiet: Diet) => {
        toggleDietFilter(newDiet);
    }

    const sortAscending = () => {
        sortByName(false); // ascending
    }

    const sortDescending = () => {
        sortByName(true); // descending
    }

    const hasActiveFilters = !!(
        currentKingdomFilter ||
        currentClassFilter ||
        currentFamilyFilter ||
        currentDietFilter
    );

    const handleClearFilters = () => {
        clearFilters();
    }

    return (
        <>
            <TouchableOpacity style={styles.filterButton} onPress={() => setVisible(true)}>
                <ThemedIcon
                    name={"filter"}
                    size={24}
                    color={hasActiveFilters ? selectedBackground : undefined}
                />
                {hasActiveFilters &&
                    <ThemedView style={[styles.filterIndicator, {backgroundColor: selectedBackground}]}/>}
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={visible}
                onRequestClose={() => setVisible(false)}
            >
                <TouchableOpacity
                    style={styles.dismissButton}
                    onPress={() => setVisible(false)}
                />

                <ThemedView style={styles.modalContent}>

                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setVisible(false)}
                    >
                        <ThemedIcon name={"close"} size={25}/>
                    </TouchableOpacity>

                    {/* Sort Section */}
                    <ThemedView style={styles.sortContainer}>
                        <ThemedText>Trier :</ThemedText>
                        <TouchableOpacity onPress={sortAscending}>
                            <ThemedIcon name={"chevron-up-outline"} size={25}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={sortDescending}>
                            <ThemedIcon name={"chevron-down-outline"} size={25}/>
                        </TouchableOpacity>
                    </ThemedView>

                    {/* Clear Filters Button */}
                    {hasActiveFilters && (
                        <TouchableOpacity
                            style={styles.clearFiltersButton}
                            onPress={handleClearFilters}
                        >
                            <ThemedText style={styles.clearFiltersText}>
                                Effacer les filtres
                            </ThemedText>
                            <ThemedIcon name={"refresh-outline"} size={20}/>
                        </TouchableOpacity>
                    )}


                    {/* Filter Selectors */}
                    <FilterEnumSelector
                        label='Reigne :'
                        enumType={Kingdom}
                        value={currentKingdomFilter}
                        selectedColor={selectedBackground}
                        onFilterChange={onKingdomChange}
                    />

                    <FilterEnumSelector
                        label='Diète :'
                        enumType={Diet}
                        value={currentDietFilter}
                        selectedColor={selectedBackground}
                        onFilterChange={onDietChange}
                    />

                    <FilterEnumSelector
                        label='Classe :'
                        enumType={Class}
                        value={currentClassFilter}
                        selectedColor={selectedBackground}
                        onFilterChange={onClassChange}
                    />

                    <FilterEnumSelector
                        label='Famille :'
                        enumType={Family}
                        value={currentFamilyFilter}
                        selectedColor={selectedBackground}
                        onFilterChange={onFamilyChange}
                    />
                </ThemedView>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    filterButton: {
        borderRadius: 15,
        padding: 5,
        width: "10%",
        position: 'relative',
    },
    filterIndicator: {
        position: 'absolute',
        top: 2,
        right: 2,
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    dismissButton: {
        flex: 1,
        width: "100%",
    },
    modalContent: {
        width: '100%',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        paddingVertical: 20,
        padding: 7,
        alignItems: "center",
        bottom: 0,
        gap: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        borderRadius: 30,
    },
    sortContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 5,
    },
    clearFiltersButton: {
        marginRight: 8,
        marginBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-end',
        gap: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    clearFiltersText: {
        fontSize: 14,
        fontWeight: '500',
    },
});