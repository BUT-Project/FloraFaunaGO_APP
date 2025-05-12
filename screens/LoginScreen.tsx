import React from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import normalize from '@/components/ui/responsive/Normalize';
import {Link} from "expo-router";
import {Entypo, FontAwesome} from "@expo/vector-icons";
import {InputWithIcon} from "@/components/ui/InputWithIcon";
import {useLoginViewModel} from "@/hooks/viewModels/auth/useLoginViewModel";

export interface LoginCredentials {
    email: string;
    password: string;
}

export default function LoginScreen() {
    const {
        username,
        setUsername,
        isLoading,
        password,
        setPassword,
        rememberMe,
        failedLogin,
        submitForm,
        toggleRememberMe
    } = useLoginViewModel();

    return (
        <View style={styles.content}>

            <Text style={styles.title}>SE CONNECTER</Text>
            {failedLogin && (
                <Text style={styles.errorText}>Email ou mot de passe incorrect!</Text>
            )}
            <InputWithIcon
                icon="user"
                placeholder="Email"
                value={username}
                onChangeText={setUsername}
                keyboardType="email-address"
            />
            <InputWithIcon
                icon="lock"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <View style={styles.rememberMeContainer}>
                <TouchableOpacity
                    style={[styles.checkbox, rememberMe && styles.checkboxChecked]}
                    onPress={toggleRememberMe}
                >
                    {rememberMe && (
                        <FontAwesome name="check" color="white" size={14}/>
                    )}
                </TouchableOpacity>
                <Text style={styles.rememberMeText}>SE SOUVENIR DE MOI</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={submitForm} disabled={isLoading}>
                <Entypo name="check" size={40} color="#AFEDEC"/>
            </TouchableOpacity>
            <View style={styles.footer}>
                <Text style={styles.footerText}>Tu n'as pas de compte? </Text>
                <Link href="/register" replace>
                        <Text style={styles.linkText}>S'inscrire</Text>
                </Link>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    content: {
        alignItems: 'center',
        width: '100%',
    },
    title: {
        fontWeight: 'bold',
        fontSize: normalize(29),
        color: 'white',
        marginBottom: normalize(20),
    },
    errorText: {
        fontSize: normalize(15),
        color: "red",
        fontWeight: 'bold',
        marginBottom: normalize(10),
    },

    rememberMeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: normalize(10),
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'gray',
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#B0D5A1',
        borderColor: '#B0D5A1',
    },
    rememberMeText: {
        fontWeight: 'bold',
        fontSize: normalize(19),
        color: 'white'
    },
    button: {
        backgroundColor: 'white',
        width: normalize(100),
        height: normalize(100),
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: normalize(20),
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    footer: {
        flexDirection: 'row',
        marginTop: normalize(40),
    },
    footerText: {
        fontSize: normalize(18),
        color: 'white',
    },
    linkText: {
        fontSize: normalize(18),
        color: '#AFEDEC',
        textDecorationLine: 'underline',
    },
});
