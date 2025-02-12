import {StyleSheet, TouchableOpacity} from 'react-native';
import {ThemedText} from "@/components/ui/themed/ThemedText";

type FilterChipsProps = {
    item: any;
    selectedFilter : any;
    onFilterChange: any;
}

export default function FilterChips(props: FilterChipsProps) {
    return (
        <TouchableOpacity  
            style={[
                styles.chip,
                props.selectedFilter === props.item && styles.selectedChip,
            ]}
            onPress={() => props.onFilterChange(props.item)}
        >
            <ThemedText  style={props.selectedFilter === props.item ? styles.selectedName: styles.name }>
                {props.item.toString()}
            </ThemedText>
        </TouchableOpacity>

    );
}

const styles = StyleSheet.create({
    chip: {
        height: 30,
        backgroundColor: 'white',
        paddingHorizontal: 10, // Utilise uniquement du padding horizontal pour éviter le décalage vertical
        borderWidth: 1,
        borderColor: "#000",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        margin: 2,
    },
    selectedChip: {
        backgroundColor: '#000',
    },
    name: {
        color: '#000',
        textAlignVertical: "center", // Force le centrage vertical
        lineHeight: 30, // Égale à la hauteur du chip pour un vrai centrage
    },
    selectedName: {
        color: '#FFF',
        textAlignVertical: "center",
        lineHeight: 30,
    }
});