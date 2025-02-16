import {Redirect} from 'expo-router';
import {useEffect, useState} from 'react';
import {useAuthStore} from "@/context/zustand/strore/useAuthStore";
import {UploadContext} from "@/context/UploadContext";
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


