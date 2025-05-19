import {useCallback, useState} from "react";
import {useAudioPlayer} from "expo-audio";
import {registerSchema} from "@/components/form/auth/RegisterForm";
import IAuthService from "@/model/service/IAuthService";
import {router} from "expo-router";
import {useAuthStore} from "@/context/zustand/store/useAuthStore";

// [TODO] [Dave] Vous préférer les alert comme ici ou le msg comme dans le register
export const useRegisterViewModel = (
    repository?: IAuthService
) => {
    const register = useAuthStore((state) => state.register);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [failedSignup, setFailedSignup] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    if (!repository) throw new Error('No Auth Repository provided');


    const clickSound = useAudioPlayer(require('@/assets/sounds/click.mp3'));

    // Simple function to play the sound
    const playSound = useCallback(async () => {
        clickSound.play();
    }, [clickSound]);

    const validateForm = useCallback(() => {
        setFailedSignup(false);

        const result = registerSchema.safeParse({
            name: username,
            email,
            password,
        });

        if (!result.success) {
            setFailedSignup(true);
            const firstError = result.error.errors[0];
            setErrorMessage(firstError.message);
            return false;
        }
        return true;
    }, [username, email, password]);

    const submitForm = useCallback(async () => {
        if (validateForm()) {
            try {
                await register(email,username,password);
                setFailedSignup(false);
                await playSound();
                router.replace('/(tabs)');
            } catch (error) {
                setFailedSignup(true);
                if (error instanceof Error) {
                    setErrorMessage(error.message);
                } else {
                    setErrorMessage("Une erreur s'est produite lors de l'inscription.");
                }
            }

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