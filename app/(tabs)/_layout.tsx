import {Redirect, Tabs} from 'expo-router';
import {useContext, useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

import {TabBarIcon} from '@/components/navigation/TabBarIcon';
import {ThemedText} from "@/components/ui/themed/ThemedText";
import {Colors} from '@/constants/Colors';
import {useColorScheme} from '@/hooks/useColorScheme';
import {useAuthStore} from "@/context/zustand/strore/useAuthStore";
import {UploadContext} from "@/context/UploadContext";
import Animated, {useAnimatedStyle, withSpring} from "react-native-reanimated";
import RootNavigation from "@/navigation/RootNavigation";

export default function TabLayout() {
    const [uploading, setUploading] = useState<boolean>(false);
    const checkAuth = useAuthStore((state) => state.checkAuth);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);


    useEffect(() => {
        // Check authentication status when component mounts
        checkAuth();
    }, []);


    // Redirect to register if not authenticated
    if (!isAuthenticated) {
        return <Redirect href="/(auth)/register"/>;
    }

    return (
        <UploadContext.Provider value={{uploading, setUploading}}>
            <RootNavigation/>
        </UploadContext.Provider>

    );
}


