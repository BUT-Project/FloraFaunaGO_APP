import {useCallback, useState} from "react";
import {Audio} from "expo-av";
import {registerSchema} from "@/components/form/auth/RegisterForm";
import {Alert} from "react-native";
import IAuthService from "@/model/service/IAuthService";
import {router} from "expo-router";
import {useAuthStore} from "@/context/zustand/strore/AuthStore";

export interface RegisterCredentials {
    email: string;
    password: string;
    name: string;
}

export const useRegisterViewModel = (
    repository?: IAuthService
) => {

    if (!repository) throw new Error('No Auth Repository provided');

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [failedSignup, setFailedSignup] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const playSound = useCallback(async () => {
        const {sound} = await Audio.Sound.createAsync(
            require('@/assets/sounds/click.mp3')
        );
        await sound.playAsync();
    }, []);

    const validateForm = useCallback(() => {
        const result = registerSchema.safeParse({
            name: username,
            email,
            password,
        });

        if (!result.success) {
            const firstError = result.error.errors[0];
            Alert.alert("Erreur inscription", firstError.message);
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
            console.log("helllooo")
            const { register } = useAuthStore();

            await register(email, password);
            const result = await repository?.register(credentials.email, credentials.password);
            console.log(result);
            if (result) {
                setFailedSignup(false);
                router.replace('/(tabs)');

            } else {
                setFailedSignup(true);
                setErrorMessage("Une erreur s'est produite lors de l'inscription.");
            }

            await playSound();
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