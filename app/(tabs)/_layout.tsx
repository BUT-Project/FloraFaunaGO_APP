import {Redirect} from 'expo-router';
import {useEffect, useState} from 'react';
import {useAuthStore} from "@/context/zustand/strore/useAuthStore";
import {UploadContext} from "@/context/UploadContext";
import RootNavigation from "@/navigation/RootNavigation";
import {ThemedView} from "@/components/ui/themed/ThemedView";
import {ActivityIndicator} from "react-native";
import SuccessWrapper from '@/components/animation/sucess/SuccessWrapper';
import { Toasts } from '@backpackapp-io/react-native-toast';
export default function TabLayout() {
    //créer un wrapper pour l'appelle des popup success
    const [uploading, setUploading] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const checkAuth = useAuthStore((state) => state.checkAuth);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    useEffect(() => {
        const initAuth = async () => {
            try {
                await checkAuth();
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, [checkAuth]);

    if (isLoading) {
        return (
            <ThemedView style={{ flex: 1 }} >
                <ActivityIndicator size="large" />
            </ThemedView>
        );
    }

    if (!isAuthenticated) {
        return <Redirect href="/(auth)/register" />;
    }

    return (
        <UploadContext.Provider value={{ uploading, setUploading }}>
            <SuccessWrapper>     
                    <RootNavigation />
                    <Toasts />
            </SuccessWrapper>
        </UploadContext.Provider>
    );
}