import ParallaxScrollView from "@/components/ParallaxScrollView";
import Ionicons from "@expo/vector-icons/Ionicons";
import {ThemedView} from "@/components/ui/themed/ThemedView";
import {ThemedText} from "@/components/ui/themed/ThemedText";
import {Collapsible} from "@/components/ui/Collapsible";
import {ExternalLink} from "@/components/ExternalLink";
import {FlatList, Image, Platform, StyleSheet} from "react-native";
import {SearchBar} from "react-native-screens";
import {Specie} from "@/app/(tabs)/encyclopedia";
import SpeciesListItem from "@/components/encyclopedia/SpeciesListItem";
import {SafeAreaView} from "react-native-safe-area-context";
interface EncyclopediaScreenProps{
    species : Specie[]
}
export default function EncyclopediaScreen(props: EncyclopediaScreenProps){
    return (
        <SafeAreaView style={{flex:1}}>
            <SearchBar/>
            <FlatList
                style={styles.speciesList}
                showsVerticalScrollIndicator={false}
                columnWrapperStyle={styles.columnWrapper}
                contentContainerStyle={styles.listContent}
                data={props.species}
                keyExtractor={specie => String(specie.id)}
                renderItem={(specie) => <SpeciesListItem specie={specie.item}/>}
                numColumns={3}

            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    speciesList:{
        flex: 1,
        marginTop: 10,
    },
    listContent: {
        padding: 5,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
});
