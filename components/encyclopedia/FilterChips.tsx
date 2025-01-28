import {StyleSheet, TouchableOpacity} from 'react-native';
import { ThemedText } from "@/components/ui/themed/ThemedText";

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
        height:30,
        backgroundColor: 'white', // Correction de la faute de frappe
        padding: 5,
        borderWidth:1,
        borderColor:"#000",
        justifyContent:"center",
        alignItems:"center",
        borderRadius: 10,
        margin:2,
    },
    selectedChip: {
        backgroundColor: '#000',
    },
    name:{
        color:'#000'
    },
    selectedName:{
        color:'#FFF'
    }
});