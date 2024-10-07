import {ThemedText} from "@/components/ui/themed/ThemedText";
import {FlatList, Image, StyleSheet, TouchableOpacity, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useThemeColor} from "@/hooks/useThemeColor";
import React from "react";
import {SucessStub} from "@/model/domain/SucessStub";
import SucessListItemVertical from "@/components/SucessListItemVertical";
import {ThemedView} from "@/components/ui/themed/ThemedView";
import {Link} from 'expo-router';
import {TabBarIcon} from "@/components/navigation/TabBarIcon";
import {AntDesign, FontAwesome5, FontAwesome6} from "@expo/vector-icons";

const ProfileImage = require("../assets/images/ProfileImage.jpeg");

export default function ProfilScreen() {
    const stub = new SucessStub();
    const sampleSuccesses = stub.getSuccesses();
    const tintColor = useThemeColor({light: 'black', dark: 'white'}, 'background');

    const renderHeader = () => (
        <ThemedView>
            <Link href={"/(profil)/settings"}  style={{ alignSelf: "flex-end",}} asChild>
                <TouchableOpacity>
                    <TabBarIcon size={30} name="settings" style={[styles.settings, {color: tintColor}]}/>
                </TouchableOpacity>
            </Link>

            <Image source={ProfileImage} style={styles.profile}/>
            <ThemedText style={styles.title}>──── Statistiques ────</ThemedText>

            <ThemedView style={styles.container}>
                <FontAwesome5 size={32} name="walking" style={[styles.settings, {color: tintColor}]}/>
                <ThemedText style={styles.text}>  Distance marchées</ThemedText>
            </ThemedView>
            <ThemedView style={styles.container}>
                <FontAwesome6 size={30} name="circle-question" style={[styles.settings, {color: tintColor}]}/>
                <ThemedText style={styles.text}>Espèces découvertes</ThemedText>
            </ThemedView>
            <ThemedView style={styles.container}>
                <FontAwesome5 size={30} name="dna" style={[styles.settings, {color: tintColor}]}/>
                <ThemedText style={styles.text}> Familles complétées</ThemedText>
            </ThemedView>
            <ThemedView style={styles.container}>
                <AntDesign size={30} name="clockcircleo" style={[styles.settings, {color:tintColor}]}/>
                <ThemedText style={styles.text}>Date d'inscription</ThemedText>
            </ThemedView>
            <ThemedText style={styles.title}>────── Succès ──────</ThemedText>
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
        alignItems: 'center',
        marginLeft:'23%',
        justifyContent: 'flex-start',
        height: 50,
        marginVertical: 5,
    },
    title: {
        textAlign: "center",
        fontWeight: "bold",
        marginTop: 35,
        margin: 20,
        fontSize: 24,
    },
    text: {
        textAlignVertical:'center',
        fontSize: 16,
    },
    settings: {
        marginRight: 10,
        color: "white",
    },
    profile: {
        alignSelf: "center",
        width: 160,
        height: 160,
        margin: 30,
        borderRadius: 500,
    },
});
