import ParallaxScrollView from "@/components/ParallaxScrollView";
import Ionicons from "@expo/vector-icons/Ionicons";
import {ThemedView} from "@/components/ui/themed/ThemedView";
import {ThemedText} from "@/components/ui/themed/ThemedText";
import {Collapsible} from "@/components/ui/Collapsible";
import {ExternalLink} from "@/components/ExternalLink";
import {FlatList, Image, Platform, StyleSheet} from "react-native";
import {SearchBar} from "react-native-screens";

export default function EncyclopediaScreen(){
    return (
        <ThemedView>
            <SearchBar>

            </SearchBar>

        </ThemedView>
    )
}

const styles = StyleSheet.create({
    headerImage: {
        color: '#808080',
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
    },
});
