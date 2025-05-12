import {Appearance, Dimensions, Pressable, ScrollView, StyleSheet, Switch, TouchableOpacity} from "react-native";
import {ThemedView} from "@/components/ui/themed/ThemedView";
import {ThemedText} from "@/components/ui/themed/ThemedText";
import React, {useEffect, useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {LinearGradient} from 'expo-linear-gradient';


const { width,height } = Dimensions.get('window');
export default function SettingsScreen() {
    const systemTheme = Appearance.getColorScheme();
    const [theme, setTheme] = useState(systemTheme || 'light'); // État du thème
    const [switchTheme, setSwitchTheme] = useState(false);
    const switchThemes = () => {
        setSwitchTheme(previousState => !previousState);
    }; 

    useEffect(() => {
        Appearance.setColorScheme(theme); // Appliquer le schéma de couleurs actuel
    }, [theme]);


    const toggleTheme = () => {
        setTheme(prevTheme => {
            const newTheme = prevTheme === 'light' ? 'dark' : 'light';
            Appearance.setColorScheme(newTheme);
            return newTheme;
        });
    };
    const [switchBut, setswitchBut] = useState(false);
    const switchChange = () => {
        setswitchBut(previousState => !previousState);
    };

    return (
<ScrollView style={{flex:1}} contentContainerStyle={{flexGrow: 1}} >
        <ThemedView  style={{flex: 1}}>

            <LinearGradient style={{flex:1}}  colors={["#90EE90","#0D98BA"]}>
             <SafeAreaView>

                 <ThemedText type={"title"} style={styles.title}>Settings</ThemedText>
                 <Pressable onPress={switchChange} style={styles.button}>
                     <ThemedText type={"subtitle"} style={styles.buttonText}>Mode offline</ThemedText>
                     <Switch value={switchBut} trackColor={{false: "#767577", true: "#90EE90"}} style={styles.switch}  />
                 </Pressable>

                 <TouchableOpacity style={styles.button}>
                     <ThemedText type={"subtitle"} style={styles.buttonText}>Modifier l'adresse mail</ThemedText>
                 </TouchableOpacity>

                 <TouchableOpacity onPress={toggleTheme} style={styles.button}>
                     <ThemedText type={"subtitle"} style={styles.buttonText}>Changer le thème ☀️</ThemedText>
                     <Switch value={switchTheme} trackColor={{false: "#767577", true: "#90EE90"}} style={styles.switch}  />
                     <ThemedText type={"subtitle"} style={styles.buttonText}>🌑</ThemedText>
                 </TouchableOpacity>

                 <TouchableOpacity style={styles.button}>
                     <ThemedText type={"subtitle"} style={styles.buttonText}>Activer l'économie de batterie</ThemedText>
                 </TouchableOpacity>

                 <TouchableOpacity style={styles.button}>
                     <ThemedText type={"subtitle"} style={styles.buttonText}>Deconnexion</ThemedText>
                 </TouchableOpacity>

                 <TouchableOpacity style={styles.button}>
                     <ThemedText type={"subtitle"} style={[styles.deleteText]}>Supprimer le compte</ThemedText>
                 </TouchableOpacity>
             </SafeAreaView>
            </LinearGradient>
        </ThemedView>
</ScrollView>

    );
}
const styles = StyleSheet.create({
    scrollContainer: {
        display:"flex",
        flex:1,

    },
    safeArea: {
        flex: 1,
        paddingHorizontal: '5%',
    },
    title: {
        fontWeight: "bold",
        margin:25,
        alignSelf: "center",
        color: "#FFFFFF",
    },
    switch: {

    },
    button: {
        alignSelf: "center",
        flexDirection: "row",
        justifyContent: "center",
        padding: 10,
        minWidth: "80%",
        borderRadius: 10,
        height:50,
        marginVertical: "4%",
        backgroundColor: "#FFFFFF",
    },
    buttonText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    deleteText: {
        color: '#ff0000',
        fontWeight: 'bold',
        fontSize: 16,
    },
});