import { StyleSheet } from 'react-native';
import { ThemedText } from "@/components/ui/themed/ThemedText";

type FilterChipsProps = {
    name: string;
}

export default function FilterChips(props: FilterChipsProps) {
    return (
        <ThemedText style={styles.chip}>
            {props.name}
        </ThemedText>
    );
}

const styles = StyleSheet.create({
    chip: {
        height:30,
        color: '#000',
        backgroundColor: 'white', // Correction de la faute de frappe
        padding: 5,
        borderWidth:1,
        borderColor:"#000",
        textAlign: 'center',
        borderRadius: 10,
    },
});