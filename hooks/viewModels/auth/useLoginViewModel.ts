import {useCallback, useState} from "react";
import {useAuthStore} from "@/context/zustand/store/useAuthStore";
import {router} from "expo-router";
import {LoginCredentials} from "@/screens/LoginScreen";
import {useAudioPlayer} from "expo-audio";
import {loginSchema} from "@/components/form/auth/LoginForm";


export function useLoginViewModel() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [failedLogin, setFailedLogin] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);


    const login = useAuthStore((state) => state.login);

    const clickSound = useAudioPlayer(require('@/assets/sounds/click.mp3'));

    // Simple function to play the sound
    const playSound = useCallback(async () => {
        clickSound.play();
    }, [clickSound]);

    const validateForm = useCallback(() => {
        setFailedLogin(false);
        const result = loginSchema.safeParse({
            Mail: username.toLowerCase().trim(),
            password: password
        });


        if (!result.success) {
            console.log("dijqs")

            setFailedLogin(true);
            const firstError = result.error.errors[0];
            setErrorMessage(firstError.message);
            return false;
        }
        return true;
    }, [username, password]);

    const submitForm = useCallback(async () => {
        if (validateForm()) {
            const credentials: LoginCredentials = {
                mail: username.toLowerCase().trim(),
                password: password
            };

            setIsLoading(true);
            try {
                await login(credentials.mail, credentials.password, rememberMe);
                setFailedLogin(false);
                await playSound();

                // If login is successful, redirect to the main app
                router.replace('/(tabs)');
            } catch (error) {
                setFailedLogin(true);
                if (error instanceof Error) {
                    setErrorMessage(error.message);
                } else {
                    setErrorMessage("Une erreur s'est produite lors de la connexion.");
                }
            } finally {
                setIsLoading(false);
            }
        }
    }, [validateForm, username, password, login, rememberMe, playSound]);

    const toggleRememberMe = useCallback(() => {
        setRememberMe(prev => !prev);
    }, []);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const clearForm = useCallback(() => {
        setUsername('');
        setPassword('');
        setFailedLogin(false);
        setErrorMessage('');
    }, []);

    return {
        username,
        setUsername,
        password,
        setPassword,
        rememberMe,
        failedLogin,
        errorMessage,
        isLoading,
        submitForm,
        toggleRememberMe,
        clearForm,
        showPassword,
        togglePasswordVisibility,
    };
}