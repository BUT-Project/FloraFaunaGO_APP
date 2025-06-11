import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import { ThemedView,ThemedText } from '../ui/themed';

type FilterChipsProps = {
    item: any;
    isSelected : Boolean;
    onFilterChange: (item: any) => void;
    selectedColor:string;
    renderLabel?: (item:any) => string;
}

const FilterChips = ({item,isSelected,onFilterChange, selectedColor, renderLabel}: FilterChipsProps) => {
    return (
        <TouchableOpacity onPress={() => onFilterChange(item)}>
            <ThemedView style={[
                styles.chip,
                isSelected && {backgroundColor:selectedColor,borderColor:selectedColor},
            ]}>
                <ThemedText  style={isSelected ? styles.selectedName: styles.name }>
                    {renderLabel ? renderLabel(item) : item.toString()}
                </ThemedText>
            </ThemedView>
           
        </TouchableOpacity>

    );
}

const styles = StyleSheet.create({
    chip: {
        height: 30,
        paddingHorizontal: 10, // Utilise uniquement du padding horizontal pour éviter le décalage vertical
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        margin: 2,
    },
    name: {
        textAlignVertical: "center", // Force le centrage vertical
        lineHeight: 30, // Égale à la hauteur du chip pour un vrai centrage
    },
    selectedName:{
        color:"#fff"
    }
});

export default React.memo(FilterChips);