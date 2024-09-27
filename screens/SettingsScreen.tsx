import {useThemeColor} from "@/hooks/useThemeColor";
import {View} from "react-native";
import {ThemedView} from "@/components/ui/themed/ThemedView";
import {ThemedText} from "@/components/ui/themed/ThemedText";


export default function SettingsScreen() {
    const tintColor = useThemeColor({light: 'black', dark: 'white'}, 'background');
    return (
        <ThemedView style={{flex: 1}}>
            <ThemedText>dksjfdkj</ThemedText>
        </ThemedView>

    );

}