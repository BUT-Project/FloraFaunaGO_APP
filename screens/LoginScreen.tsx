import React from 'react';
import {
    View,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity, Platform,
} from 'react-native';
import normalize from '@/components/ui/responsive/Normalize';

import {useState, useCallback} from 'react';
import {Alert} from 'react-native';
import {useRouter} from "expo-router";
import {ThemedView} from "@/components/ui/themed/ThemedView";
import {Entypo, FontAwesome} from "@expo/vector-icons";
import DismissKeyboard from "@/components/ui/DismissKeyboard";
import {InputWithIcon} from "@/components/ui/InputWithIcon";

export interface LoginCredentials {
    email: string;
    password: string;
}

export default function LoginScreen() {
    const router = useRouter();
    const {
        username,
        setUsername,
        password,
        setPassword,
        rememberMe,
        failedLogin,
        submitForm,
        toggleRememberMe
    } = useLoginViewModel();

    return (
        <DismissKeyboard>
            <ThemedView style={styles.container}>
                <Text style={styles.versionText}>v2.0</Text>
                <Image source={require("../assets/images/logo_FFGO.png")} style={styles.imageLogo}/>
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
                <TouchableOpacity style={styles.button} onPress={submitForm}>
                    <Entypo name="check" size={40} color="#AFEDEC"/>
                </TouchableOpacity>
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Tu n'as pas de compte? </Text>
                    <TouchableOpacity onPress={() => router.replace('/register')}>
                        <Text style={styles.linkText}>S'inscrire</Text>
                    </TouchableOpacity>
                </View>
            </ThemedView>
        </DismissKeyboard>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    versionText: {
        position: 'absolute',
        top: 40,
        right: 20,
        color: 'gray',
        fontWeight: 'bold',
        fontSize: normalize(17)
    },
    imageLogo: {
        width: normalize(324),
        height: normalize(162),
        resizeMode: "contain",
        marginBottom: normalize(40),
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

function useLoginViewModel() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [failedLogin, setFailedLogin] = useState(false);

    const simulateLogin = useCallback((credentials: LoginCredentials, rememberMe: boolean) => {
        return new Promise<boolean>((resolve) => {
            setTimeout(() => {
                // Simulate a successful login if the email includes "@" and password is not empty
                const success = credentials.email.includes('@') && credentials.password.length > 0;
                resolve(success);
            }, 1000); // Simulate network delay
        });
    }, []);

    const submitForm = useCallback(async () => {
        const credentials: LoginCredentials = {
            email: username.toLowerCase().trim(),
            password: password
        };

        try {
            const success = await simulateLogin(credentials, rememberMe);
            if (success) {
                setFailedLogin(false);
                Alert.alert('Success', 'Login successful!');
            } else {
                setFailedLogin(true);
            }
        } catch (error) {
            Alert.alert('Error', 'A network error occurred. Please try again.');
        }
    }, [username, password, rememberMe, simulateLogin]);

    const toggleRememberMe = useCallback(() => {
        setRememberMe(prev => !prev);
    }, []);

    return {
        username,
        setUsername,
        password,
        setPassword,
        rememberMe,
        failedLogin,
        submitForm,
        toggleRememberMe
    };
}
