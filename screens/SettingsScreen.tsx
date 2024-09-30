import {Appearance, Pressable, StyleSheet, Switch, TouchableOpacity} from "react-native";
import {ThemedView} from "@/components/ui/themed/ThemedView";
import {ThemedText} from "@/components/ui/themed/ThemedText";
import React, {useEffect, useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import { LinearGradient } from 'expo-linear-gradient';


export default function SettingsScreen() {
    const systemTheme = Appearance.getColorScheme();
    const [theme, setTheme] = useState(systemTheme || 'light'); // État du thème


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

        <ThemedView style={{flex: 1}}>
            <LinearGradient style={{flex:1}}  colors={["#90EE90","#0D98BA"]}>
             <SafeAreaView>

                 <ThemedText style={styles.title}>Settings</ThemedText>
                 <Pressable onPress={switchChange} style={styles.button}>
                     <ThemedText style={styles.buttonText}>Mode offline</ThemedText>
                     <Switch value={switchBut} trackColor={{false: "#767577", true: "#90EE90"}} style={styles.switch}  />
                 </Pressable>

                 <TouchableOpacity style={styles.button}>
                     <ThemedText style={styles.buttonText}>Modifier l'adresse mail</ThemedText>
                 </TouchableOpacity>

                 <TouchableOpacity onPress={toggleTheme} style={styles.button}>
                     <ThemedText style={styles.buttonText}>Changer le thème</ThemedText>
                 </TouchableOpacity>

                 <TouchableOpacity style={styles.button}>
                     <ThemedText style={styles.buttonText}>Activer l'économie de batterie</ThemedText>
                 </TouchableOpacity>

                 <TouchableOpacity style={styles.button}>
                     <ThemedText style={styles.buttonText}>Deconnexion</ThemedText>
                 </TouchableOpacity>

                 <TouchableOpacity style={styles.button}>
                     <ThemedText style={[styles.deleteText]}>Supprimer le compte</ThemedText>
                 </TouchableOpacity>
             </SafeAreaView>
            </LinearGradient>
        </ThemedView>

    );
}
const styles = StyleSheet.create({
    title:{
        margin:30,
        padding:25,
        fontWeight:"bold",
        fontSize : 32,
        alignSelf:"center",
        color : "#FFFFFF"
    },
    switch:{
        paddingLeft:10,
    },
    button: {
        height:50,
        alignSelf : "center",
        flexDirection:"row",
        justifyContent:"center",
        padding: 10,
        minWidth:"90%",
        borderRadius: 10,
        marginVertical: 10,
        width: '80%',
        alignItems: 'center',
        backgroundColor : "#FFFFFF"
    },
    buttonText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    deleteText:{
        color:'#ff0000',
        fontSize: 16,
        fontWeight: 'bold'
    }
});