import React from 'react';
import {ActivityIndicator, Platform, StyleSheet, TouchableOpacity} from 'react-native';
import {Link} from "expo-router";
import normalize from "@/components/ui/responsive/Normalize";
import {InputWithIcon} from "@/components/ui/InputWithIcon";
import {useRegisterViewModel} from "@/hooks/viewModels/auth/useRegisterViewModel";
import StubData from "@/dal/StubLib/StubData";
import {Entypo} from "@expo/vector-icons";
import {ThemedText, ThemedView} from "@/components/ui/themed";
import {useThemeColor} from "@/hooks/useThemeColor";

export default function RegisterScreen() {
    const {authService} = StubData.getInstance();

    const textColor = useThemeColor({}, 'text');
    const tintColor = useThemeColor({}, 'tint');

    const {
        email,
        setEmail,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        failedSignup,
        errorMessage,
        submitForm,
        isLoading
    } = useRegisterViewModel(authService);

    return (
        <ThemedView style={styles.content}>
            <ThemedText style={[styles.title, {color: textColor}]}>S'INSCRIRE</ThemedText>
            {failedSignup && (
                <ThemedText style={styles.errorText}>{errorMessage}</ThemedText>
            )}
            <InputWithIcon
                icon="envelope"
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize='none'
                autoCorrect={false}
            />
            <InputWithIcon
                icon="lock"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize='none'
                autoCorrect={false}
            />
            <InputWithIcon
                icon="lock"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize='none'
                autoCorrect={false}
            />
            <TouchableOpacity 
                style={[styles.button, {backgroundColor: textColor}]} 
                onPress={submitForm}
                disabled={isLoading}
            >
                {isLoading ?
                    <ActivityIndicator size="large" color="#fff"/>
                    :
                    <Entypo name="check" size={40} color={tintColor}/>
                }
            </TouchableOpacity>
            <ThemedView style={styles.footer}>
                <ThemedText style={styles.footerText}>Tu as déjà un compte? </ThemedText>
                <Link href="/login" replace>
                    <ThemedText style={[styles.linkText, {color: tintColor}]}>Se connecter</ThemedText>
                </Link>
            </ThemedView>
        </ThemedView>)
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