import {useCallback, useState} from "react";
import {useAudioPlayer} from "expo-audio";
import {registerFormSchema} from "@/components/form/auth/RegisterForm";
import IAuthService from "@/model/service/IAuthService";
import {router} from "expo-router";
import {useAuthStore} from "@/context/zustand/store/useAuthStore";

// [TODO] [Dave] Vous préférer les alert comme ici ou le msg comme dans le register
export const useRegisterViewModel = (
    repository?: IAuthService
) => {
    const register = useAuthStore((state) => state.register);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [failedSignup, setFailedSignup] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!repository) throw new Error('No Auth Repository provided');


    const clickSound = useAudioPlayer(require('@/assets/sounds/click.mp3'));

    // Simple function to play the sound
    const playSound = useCallback(async () => {
        clickSound.play();
    }, [clickSound]);

    const validateForm = useCallback(() => {
        setFailedSignup(false);

        const result = registerFormSchema.safeParse({
            email,
            password,
            confirmPassword,
        });

        if (!result.success) {
            setFailedSignup(true);
            const firstError = result.error.errors[0];
            setErrorMessage(firstError.message);
            return false;
        }
        return true;
    }, [ email, password, confirmPassword]);

    const submitForm = useCallback(async () => {
        if (validateForm()) {
            setIsLoading(true);
            try {
                await register(email,password);
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
            finally {
                setIsLoading(false);
            }

        }
    }, [validateForm, email, password, playSound]);


    return {
        email,
        setEmail,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        failedSignup,
        isLoading,
        errorMessage,
        submitForm,
    };
};