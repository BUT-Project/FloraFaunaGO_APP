import {ThemedText} from "@/components/ui/themed/ThemedText";
import {FlatList, Image, StyleSheet, TouchableOpacity} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useThemeColor} from "@/hooks/useThemeColor";
import React from "react";
import {SucessStub} from "@/model/SucessStub";
import SucessListItemVertical from "@/components/SucessListItemVertical";
import {ThemedView} from "@/components/ui/themed/ThemedView";
import {Link} from 'expo-router';

const ProfileImage = require("../assets/images/ProfileImage.jpeg");
const SettingsImage = require("../assets/images/settings.png");
const DistanceImage = require("../assets/images/man-walking.png");
const UnknownImage = require("../assets/images/unknown.png");
const FamilleImage = require("../assets/images/famille.png");
const TimeImage = require("../assets/images/clock.png");

export default function ProfilScreen() {
    const stub = new SucessStub();
    const sampleSuccesses = stub.getSuccesses();
    const tintColor = useThemeColor({light: 'black', dark: 'white'}, 'background');

    const renderHeader = () => (
        <ThemedView>
            <Link href={"/(profil)/settings"}  style={{ alignSelf: "flex-end",}} asChild>
                <TouchableOpacity>
                    <Image source={SettingsImage} style={[styles.settings, {tintColor}]}/>
                </TouchableOpacity>
            </Link>

            <Image source={ProfileImage} style={styles.profile}/>
            <ThemedText style={styles.title}>Statistiques</ThemedText>

            <ThemedView style={styles.container}>
                <Image source={DistanceImage} style={[styles.image, {tintColor}]}/>
                <ThemedText style={styles.text}>Distance marchées</ThemedText>
            </ThemedView>
            <ThemedView style={styles.container}>
                <Image source={UnknownImage} style={[styles.image, {tintColor}]}/>
                <ThemedText style={styles.text}>Espèces découvertes</ThemedText>
            </ThemedView>
            <ThemedView style={styles.container}>
                <Image source={FamilleImage} style={[styles.image, {tintColor}]}/>
                <ThemedText style={styles.text}>Familles complétées</ThemedText>
            </ThemedView>
            <ThemedView style={styles.container}>
                <Image source={TimeImage} style={[styles.image, {tintColor}]}/>
                <ThemedText style={styles.text}>Date d'inscription</ThemedText>
            </ThemedView>

            <ThemedText style={styles.title}>Succès</ThemedText>
        </ThemedView>
    );

    return (
        <ThemedView style={{flex: 1}}>
            <SafeAreaView>
                <FlatList
                    data={sampleSuccesses}
                    keyExtractor={(item) => item.nom}
                    renderItem={({item}) => <SucessListItemVertical items={item}/>}
                    numColumns={3}
                    ListHeaderComponent={renderHeader}
                />
            </SafeAreaView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignSelf: "center",
        height: 45,
    },
    title: {
        height: 50,
        textAlign: "center",
        margin: 20,
        fontSize: 24,
    },
    text: {
        height: 50,
        textAlign: "center",
        margin: 5,
    },
    settings: {
        tintColor: "white",
        width: 35,
        height: 35,
        margin: 10,
    },
    image: {
        width: 30,
        height: 30,
        margin: 5,
        alignSelf: "center",
    },
    profile: {
        alignSelf: "center",
        width: 160,
        height: 160,
        margin: 30,
        borderRadius: 500,
    },
});
