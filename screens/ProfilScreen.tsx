import { ThemedText } from "@/components/ui/themed/ThemedText";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/useThemeColor";
import React, { useState } from "react";
import { SucessStub } from "@/screens/SucessStub";
import SucessListItemVertical from "@/components/SucessListItemVertical";

const ProfileImage = require("../assets/images/ProfileImage.jpeg");
const SettingsImage = require("../assets/images/settings.png");
const DistanceImage = require("../assets/images/man-walking.png");
const UnknownImage = require("../assets/images/unknown.png");
const FamilleImage = require("../assets/images/famille.png");
const TimeImage = require("../assets/images/clock.png");

export default function ProfilScreen() {
    const stub = new SucessStub();
    const sampleSuccesses = stub.getSuccesses();
    const tintColor = useThemeColor({ light: 'black', dark: 'white' }, 'background');

    const renderHeader = () => (
        <View>
            <Image source={SettingsImage} style={[styles.settings, { tintColor }]} />
            <Image source={ProfileImage} style={styles.profile} />
            <ThemedText style={styles.title}>Statistiques</ThemedText>

            <View style={styles.container}>
                <Image source={DistanceImage} style={[styles.image, { tintColor }]} />
                <ThemedText style={styles.text}>Distance marchées</ThemedText>
            </View>
            <View style={styles.container}>
                <Image source={UnknownImage} style={[styles.image, { tintColor }]} />
                <ThemedText style={styles.text}>Espèces découvertes</ThemedText>
            </View>
            <View style={styles.container}>
                <Image source={FamilleImage} style={[styles.image, { tintColor }]} />
                <ThemedText style={styles.text}>Familles complétées</ThemedText>
            </View>
            <View style={styles.container}>
                <Image source={TimeImage} style={[styles.image, { tintColor }]} />
                <ThemedText style={styles.text}>Date d'inscription</ThemedText>
            </View>

            <ThemedText style={styles.title}>Succès</ThemedText>
        </View>
    );

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <FlatList
                data={sampleSuccesses}
                keyExtractor={(item) => item.nom}
                renderItem={({ item }) => <SucessListItemVertical items={item} />}
                numColumns={3}
                ListHeaderComponent={renderHeader}
            />
        </SafeAreaView>
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
        alignSelf: "flex-end",
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
