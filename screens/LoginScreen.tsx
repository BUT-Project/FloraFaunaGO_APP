import React from 'react';
import {Platform, StyleSheet, TouchableOpacity} from 'react-native';
import normalize from '@/components/ui/responsive/Normalize';
import {Link} from "expo-router";
import {Entypo, FontAwesome} from "@expo/vector-icons";
import {InputWithIcon} from "@/components/ui/InputWithIcon";
import {useLoginViewModel} from "@/hooks/viewModels/auth/useLoginViewModel";
import {ThemedText, ThemedView} from "@/components/ui/themed";
import {useThemeColor} from "@/hooks/useThemeColor";

export interface LoginCredentials {
    email: string;
    password: string;
}

export default function LoginScreen() {
    const textColor = useThemeColor({}, 'text');
    const tintColor = useThemeColor({}, 'tint');

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
        <ThemedView style={styles.content}>

            <ThemedText style={[styles.title, {color: textColor}]}>SE CONNECTER</ThemedText>
            {failedLogin && (
                <ThemedText style={styles.errorText}>Email ou mot de passe incorrect!</ThemedText>
            )}
            <InputWithIcon
                icon="user"
                placeholder="Email"
                value={username}
                onChangeText={setUsername}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
            />
            <InputWithIcon
                icon="lock"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
            />
            <ThemedView style={styles.rememberMeContainer}>
                <TouchableOpacity
                    style={[styles.checkbox, rememberMe && styles.checkboxChecked]}
                    onPress={toggleRememberMe}
                >
                    {rememberMe && (
                        <FontAwesome name="check" color="white" size={14}/>
                    )}
                </TouchableOpacity>
                <ThemedText style={styles.rememberMeText}>SE SOUVENIR DE MOI</ThemedText>
            </ThemedView>
            <TouchableOpacity
                style={[styles.button, {backgroundColor: textColor}]}
                onPress={submitForm}
                disabled={isLoading}
            >
                <Entypo name="check" size={40} color={tintColor}/>
            </TouchableOpacity>
            <ThemedView style={styles.footer}>
                <ThemedText style={styles.footerText}>Tu n'as pas de compte? </ThemedText>
                <Link href="/register" replace>
                    <ThemedText style={[styles.linkText, {color: tintColor}]}>S'inscrire</ThemedText>
                </Link>
            </ThemedView>
        </ThemedView>
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
    },
    button: {
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
    },
    linkText: {
        fontSize: normalize(18),
        textDecorationLine: 'underline',
    },
});
