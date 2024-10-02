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
import {Audio} from 'expo-av';
import {InputWithIcon} from "@/components/ui/InputWithIcon";

export default function RegisterScreen() {
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
    } = useRegisterViewModel();

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
                <Ionicons name={'repeat'} size={40} color="#AFEDEC"/>
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

export interface RegisterCredentials {
    email: string;
    password: string;
    name: string;
}

const simulateRegister = async (credentials: RegisterCredentials): Promise<{ success: boolean, message?: string }> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (credentials.email && credentials.password && credentials.name) {
                resolve({success: true});
            } else {
                resolve({success: false, message: "Invalid credentials"});
            }
        }, 1000); // Simulate network delay
    });
};

export const useRegisterViewModel = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [failedSignup, setFailedSignup] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const playSound = useCallback(async () => {
        const {sound} = await Audio.Sound.createAsync(
            require('../assets/sounds/click.mp3')
        );
        await sound.playAsync();
    }, []);

    const validateForm = useCallback(() => {
        const isUsernameValid = /^\w+$/.test(username);
        const isEmailValid = /^\w+@\w+\.[^\s@]+$/.test(email);

        if (username.length > 30) {
            Alert.alert("Erreur inscription", "Le nom d'utilisateur ne peut pas être plus grand que 30 caractères.");
            return false;
        }
        if (username === "" || username === null) {
            Alert.alert("Erreur inscription", "Le nom d'utilisateur ne peut pas être vide.");
            return false;
        }
        if (!isUsernameValid) {
            Alert.alert("Erreur inscription", "Le nom d'utilisateur ne peut pas posséder de caractères spéciaux.");
            return false;
        }
        if (email.length > 100) {
            Alert.alert("Erreur inscription", "L'adresse e-mail ne peut pas être plus grand que 100 caractères.");
            return false;
        }
        if (!isEmailValid) {
            Alert.alert("Erreur inscription", "L'adresse e-mail n'est pas valide.");
            return false;
        }
        if (password.length < 6) {
            Alert.alert("Erreur inscription", "Le mot de passe doit avoir au moins 6 caractères");
            return false;
        }
        return true;
    }, [username, email, password]);

    const submitForm = useCallback(async () => {
        if (validateForm()) {
            const credentials: RegisterCredentials = {
                email: email,
                password: password,
                name: username
            };

            const result = await simulateRegister(credentials);
            if (result.success) {
                setFailedSignup(false);
                Alert.alert("Succès", "Inscription réussie!");
                // Here you would typically navigate to the next screen or update app state
            } else {
                setFailedSignup(true);
                setErrorMessage(result.message || "Une erreur s'est produite lors de l'inscription.");
            }

            playSound();
        }
    }, [validateForm, email, password, username, playSound]);


    return {
        username,
        setUsername,
        email,
        setEmail,
        password,
        setPassword,
        failedSignup,
        errorMessage,
        submitForm,
    };
};