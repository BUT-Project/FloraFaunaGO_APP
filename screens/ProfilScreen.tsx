import {ThemedView} from "@/components/ui/themed/ThemedView";
import {ThemedText} from "@/components/ui/themed/ThemedText";
import {FlatList, Image, StyleSheet, Text, useColorScheme, View} from "react-native";
import {SafeAreaView, useSafeAreaInsets} from "react-native-safe-area-context";
import {useTheme} from "@react-navigation/native";
import {useThemeColor} from "@/hooks/useThemeColor";
const ProfileImage = require("../assets/images/ProfileImage.jpeg")
const SettingsImage = require("../assets/images/settings.png")
const DistanceImage = require("../assets/images/man-walking.png")
const UnknownImage = require("../assets/images/unknown.png")
const FamilleImage = require("../assets/images/famille.png")
const TimeImage = require("../assets/images/clock.png")
export default function ProfilScreen() {
    const insets = useSafeAreaInsets();
    const tintColor = useThemeColor({ light: 'black', dark: 'white' }, 'background');
    return (
        <SafeAreaView style={{
            flex: 1,
        }}>

            <Image source={SettingsImage} style={[styles.settings, {tintColor}]} />
            <Image source={ProfileImage} style={styles.profile} />
            <ThemedText style={styles.text}>Statistiques</ThemedText>
            <ThemedText style={styles.text}>
            <Image source={DistanceImage} style={[styles.image, {tintColor}]} />
                Distance marchées
            </ThemedText>
            <ThemedText style={styles.text}>
            <Image source={UnknownImage} style={[styles.image, {tintColor}]} />
                Espèces découvertes
            </ThemedText>
            <ThemedText style={styles.text}>
                <Image source={FamilleImage} style={[styles.image, {tintColor}]}/>
                Familles complétées
            </ThemedText>
            <ThemedText style={styles.text}>
                <Image source={TimeImage} style={[styles.image, {tintColor}]} />
                Date début
            </ThemedText>


        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    text: {
        height : 50,
        textAlign : "center",
        margin : 5
    },
    settings : {
        tintColor : "white",
        width : 35,
        height : 35,
        margin : 10,
        alignSelf : "flex-end"

    },
    image : {
        width : 35,
        height : 35,
        margin : 5,
        alignSelf : "center"

    },
    profile : {
        alignSelf : "center",
        width : 160,
        height : 160,
        margin : 30,
        borderRadius: 500
    }

});