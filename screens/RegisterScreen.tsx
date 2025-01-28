import React, {useCallback, useState} from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity, Platform, Alert
} from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import {Link} from "expo-router";
import normalize from "@/components/ui/responsive/Normalize";
import {InputWithIcon} from "@/components/ui/InputWithIcon";
import {useRegisterViewModel} from "@/hooks/viewModels/register/useRegisterViewModel";
import StubData from "@/dal/StubLib/StubData";
import {Entypo} from "@expo/vector-icons";

export default function RegisterScreen() {
    const {authService} = StubData.getInstance();

    const {
        username,
        setUsername,
        email,
        setEmail,
        password,
        setPassword,
        failedSignup,
        errorMessage,
        submitForm,
    } = useRegisterViewModel(authService);

    return (
        <View style={styles.content}>
            <Text style={styles.title}>S'INSCRIRE</Text>
            {failedSignup && (
                <Text style={styles.errorText}>{errorMessage}</Text>
            )}
            <InputWithIcon
                icon="user"
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <InputWithIcon
                icon="envelope"
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <InputWithIcon
                icon="lock"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={submitForm}>
                <Entypo name="check" size={40} color="#AFEDEC"/>
            </TouchableOpacity>
            <View style={styles.footer}>
                <Text style={styles.footerText}>Tu as déjà un compte? </Text>
                <Link href="/login" replace>
                    <Text style={styles.linkText}>Se connecter</Text>
                </Link>
            </View>
        </View>)
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