import {Appearance, Pressable, SafeAreaView, StyleSheet, Switch, TouchableOpacity} from "react-native";
import {ThemedText, ThemedView} from "@/components/ui/themed";
import React, {useEffect, useState} from "react";
import {LinearGradient} from 'expo-linear-gradient';
import {Colors} from "@/constants/Colors";  
import {useColorScheme} from "@/hooks/useColorScheme";
import {useAuthStore} from "@/context/zustand/store/useAuthStore";
import { SafeView } from "@/components/ui/SafeView";

export default function SettingsScreen() {
    const colorScheme = useColorScheme();
    const systemTheme = Appearance.getColorScheme();
    const [theme, setTheme] = useState(systemTheme || 'light'); // État du thème
    const logout = useAuthStore((state)=>state.logout);
    const [switchTheme, setSwitchTheme] = useState((theme === 'dark') ? true : false);
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
        <SafeView style={styles.container} disableTopInset>
        <ThemedView  style={{flex: 1}}>
        <LinearGradient
            style={{ flex: 1 }}
            colors={[ Colors[(colorScheme ?? 'light') as 'light' | 'dark'].card, 
            Colors[(colorScheme ?? 'light') as 'light' | 'dark'].background]}
            >
                <ThemedText type={"title"} style={styles.title}>Settings</ThemedText>
                <Pressable onPress={switchChange} style={styles.button}>
                    <ThemedText type={"subtitle"} style={styles.buttonText}>Mode offline</ThemedText>
                    <Switch value={switchBut} trackColor={{false: "#767577", true: "#90EE90"}}  />
                </Pressable>

                <TouchableOpacity style={styles.button}>
                    <ThemedText type={"subtitle"} style={styles.buttonText}>Modifier l'adresse mail</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { toggleTheme(); switchThemes(); }} style={styles.button}>
                <ThemedText type={"subtitle"} style={styles.buttonText}>Changer le thème</ThemedText>

                <Switch
                    value={switchTheme}
                />
                <ThemedText type={"subtitle"} style={styles.buttonText}>
                    {switchTheme ? '🌑' : '☀️'}
                </ThemedText>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button}>
                    <ThemedText type={"subtitle"} style={styles.buttonText}>Activer l'économie de batterie</ThemedText>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={logout}>
                    <ThemedText type={"subtitle"} style={styles.buttonText}>Deconnexion</ThemedText>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button}>
                    <ThemedText type={"subtitle"} style={[styles.deleteText]}>Supprimer le compte</ThemedText>
                </TouchableOpacity>
            </LinearGradient>
            </ThemedView>
        </SafeView>)}
const styles = StyleSheet.create({
    container: {
        display:"flex",
        flex:1,
    },
    title: {
        fontWeight: "bold",
        margin:25,
        alignSelf: "center",
        color: "#FFFFFF",
    },
    button: {
        alignSelf: "center",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
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