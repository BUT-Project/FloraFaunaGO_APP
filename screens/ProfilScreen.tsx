import {ThemedText} from "@/components/ui/themed/ThemedText";
import {FlatList, Image, StyleSheet, TouchableOpacity,Dimensions} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useThemeColor} from "@/hooks/useThemeColor";
import React, {useEffect, useState} from "react";
import DataService from "@/dal/DataService";
import SucessListItemVertical from "@/components/SucessListItemVertical";
import {ThemedView} from "@/components/ui/themed/ThemedView";
import {Link} from 'expo-router';
import {TabBarIcon} from "@/components/navigation/TabBarIcon";
import {AntDesign, FontAwesome5, FontAwesome6} from "@expo/vector-icons";
import {Sucess} from "@/model/Sucess";
import StubData from "@/dal/StubLib/StubData";

let ProfileImage: {};
ProfileImage = require("../assets/images/ProfileImage.jpeg");
const { width,height } = Dimensions.get('window');

// const stub = new SucessStub();
// const sampleSuccesses = stub.getSuccesses();
export default function ProfilScreen() {
    const [Successes, setSuccesses] = useState<Sucess[]>([]); // Initialiser avec un tableau vide
    const {Sucess} = StubData.getInstance()
    useEffect(() => {
        Sucess.getAll().then(res => setSuccesses(res.items))
    }, []);
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
        <ThemedView>
            <SafeAreaView>
                <FlatList

                    data={Successes?? []}
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
        display:"flex",
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf : 'center',
        justifyContent: 'flex-start',
        height: width* 0.15,
        marginVertical: 5,
    },
    title: {
        textAlign: "center",
        fontWeight: "bold",
        margin: "8%",
        fontSize: width * 0.06,
    },
    text: {
        textAlignVertical:'center',
        fontSize: width* 0.05,
    },
    settings: {
        marginRight: width* 0.05,
        color: "white",
    },
    profile: {
        alignSelf: "center",
        width: width* 0.4,
        height: width* 0.4,
        margin: "10%",
        borderRadius: 500,
    },
});
