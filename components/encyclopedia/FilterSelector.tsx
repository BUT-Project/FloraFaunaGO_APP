import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { ThemedText, ThemedView } from '../ui/themed'; // adapte l'import selon ton projet
import FilterChips from './FilterChips';

interface FilterEnumSelectorProps<T> {
    label: string;
    enumType: T;
    value?:T[keyof T] | null;
    selectedColor:string;
    onFilterChange: (value: T[keyof T]) => void;
};

export function FilterEnumSelector<T extends Record<string,string>>({
    label,
    enumType,
    value,
    selectedColor,
    onFilterChange,
}: FilterEnumSelectorProps<T>) {
    return (
        <ThemedView style={styles.filteringOptions}>
            <ThemedText>{label}</ThemedText>
            <FlatList
                data={Object.values(enumType)}
                renderItem={({ item }) => (
                    <FilterChips item={item} isSelected={item == value} selectedColor={selectedColor} onFilterChange={onFilterChange} />
                )}
                keyExtractor={(item) => String(item)}
                horizontal
                showsHorizontalScrollIndicator={false}
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    filteringOptions: {
        flexDirection:"row",
        width:"100%",
        gap:7,
        alignItems:"center"
    },
});