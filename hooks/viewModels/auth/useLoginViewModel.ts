import {useCallback, useState} from "react";
import {useAuthStore} from "@/context/zustand/store/useAuthStore";
import {Alert} from "react-native";
import {router} from "expo-router";
import {LoginCredentials} from "@/screens/LoginScreen";

// [TODO] [Dave] Vous préférer les alert comme ici ou le msg comme dans le register
export function useLoginViewModel() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [failedLogin, setFailedLogin] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const login = useAuthStore((state) => state.login);

    const submitForm = useCallback(async () => {
        if (!username.trim() || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        const credentials: LoginCredentials = {
            email: username.toLowerCase().trim(),
            password: password
        };

        setIsLoading(true);
        try {
            await login(credentials.email, credentials.password, rememberMe);
            setFailedLogin(false);

            // If login is successful, redirect to the main app
            router.replace('/(tabs)');
        } catch (error) {
            setFailedLogin(true);
            if (error instanceof Error) {
                Alert.alert('Error', error.message);
            } else {
                Alert.alert('Error', 'An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [username, password, login, rememberMe]);

    const toggleRememberMe = useCallback(() => {
        setRememberMe(prev => !prev);
    }, []);

    const clearForm = useCallback(() => {
        setUsername('');
        setPassword('');
        setFailedLogin(false);
    }, []);

    return {
        username,
        setUsername,
        password,
        setPassword,
        rememberMe,
        failedLogin,
        isLoading,
        submitForm,
        toggleRememberMe,
        clearForm
    };
}