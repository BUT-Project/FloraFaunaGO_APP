import {useThemeColor} from "@/hooks/useThemeColor";
import {Appearance, Button, StyleSheet, TouchableOpacity, useColorScheme, View} from "react-native";
import {ThemedView} from "@/components/ui/themed/ThemedView";
import {ThemedText} from "@/components/ui/themed/ThemedText";
import React, {useEffect, useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context";



export default function SettingsScreen() {
    const systemTheme = Appearance.getColorScheme(); // Thème détecté par le système
    const [theme, setTheme] = useState(systemTheme || 'light'); // État du thème

    // Utiliser useEffect pour synchroniser le thème avec le système au démarrage
    useEffect(() => {
        Appearance.setColorScheme(theme); // Appliquer le schéma de couleurs actuel
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => {
            const newTheme = prevTheme === 'light' ? 'dark' : 'light'; // Inverser le thème
            Appearance.setColorScheme(newTheme);
            return newTheme;
        });
    };

    const color = useThemeColor({light: 'white', dark: 'black'}, 'background');
    const colorReverse = useThemeColor({light: 'black', dark: 'white'}, 'background');
    const backgroundColor = useThemeColor({light: 'black', dark: 'white'}, 'background');


    return (
        <ThemedView style={{flex: 1}}>
             <SafeAreaView >
                 <ThemedText style={[styles.title,{color:colorReverse}]}>Settings</ThemedText>
                 <TouchableOpacity style={[styles.button,{backgroundColor}]}>
                     <ThemedText style={[styles.buttonText,{color}]}>Mode offline</ThemedText>
                 </TouchableOpacity>

                 <TouchableOpacity style={[styles.button,{backgroundColor}]}>
                     <ThemedText style={[styles.buttonText,{color}]}>Modifier l'adresse mail</ThemedText>
                 </TouchableOpacity>

                 <TouchableOpacity onPress={toggleTheme} style={[styles.button,{backgroundColor}]}>
                     <ThemedText style={[styles.buttonText,{color}]}>Changer le thème</ThemedText>
                 </TouchableOpacity>

                 <TouchableOpacity style={[styles.button,{backgroundColor}]}>
                     <ThemedText style={[styles.buttonText,{color}]}>Activer l'économie de batterie</ThemedText>
                 </TouchableOpacity>

                 <TouchableOpacity style={[styles.button, styles.deleteButton]}>
                     <ThemedText style={[styles.buttonText,{color}]}>Supprimer le compte</ThemedText>
                 </TouchableOpacity>
             </SafeAreaView>
        </ThemedView>

    );
}
const styles = StyleSheet.create({
    title:{
        margin:30,
        padding:25,
        fontWeight:"bold",
        fontSize : 32,
        alignSelf:"center"
    },
    button: {
        alignSelf : "center",
        padding: 25,
        borderRadius: 10,
        marginVertical: 10,
        width: '80%',
        alignItems: 'center',
    },
    deleteButton: {
        backgroundColor: '#ff0000', // bouton rouge pour supprimer
    },
    buttonText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: 'bold',
    },
});