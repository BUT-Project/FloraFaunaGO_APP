import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {useFonts} from 'expo-font';
import {Stack} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {useEffect} from 'react';
import 'react-native-reanimated';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {useColorScheme} from '@/hooks/useColorScheme';
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {useAuthStore} from "@/context/zustand/store/useAuthStore";
import { getStorageItemAsync } from "@/libs/secureStore";
import '../i18n'
// Prevent the splash screens from auto-hiding before asset loading is complete or authentication is done
SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
    const queryClient = new QueryClient();
    const colorScheme = useColorScheme();
    const isAuthCheckCompleted = useAuthStore((state) => state.isAuthCheckCompleted);

    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });
    useEffect(() => {
        if (loaded && isAuthCheckCompleted) {
            SplashScreen.hideAsync();
        }
    }, [loaded, isAuthCheckCompleted]);

    // Debug: Log all secure store contents
    useEffect(() => {
        const logSecureStoreContents = async () => {
            try {
                console.log('🔒 === SECURE STORE DEBUG ===');
                
                // Try to get all known keys
                const knownKeys = [
                    'auth_token',
                    'remember_me',
                    'access_token',
                    'refresh_token',
                    'user_data'
                ];
                
                for (const key of knownKeys) {
                    try {
                        const value = await getStorageItemAsync(key);
                        console.log(`🔑 ${key}:`, value ? (typeof value === 'string' ? value.substring(0, 100) + '...' : value) : 'null');
                    } catch (error) {
                        console.log(`🔑 ${key}: Error reading - ${error}`);
                    }
                }

                console.log('🔒 === END SECURE STORE DEBUG ===');
            } catch (error) {
                console.error('❌ Error debugging secure store:', error);
            }
        };
        
        // Log on app start
        logSecureStoreContents();
    }, []);

    if (!loaded) {
        return null;
    }

    return (
    
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
              
                     <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                        <QueryClientProvider client={queryClient}>
                            <Stack>
                                <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                                <Stack.Screen name="(auth)" options={{headerShown: false}}/>
                                <Stack.Screen name="capture" options={{headerShown : false, presentation:"fullScreenModal", animation:"fade"}}/>
                                <Stack.Screen name="+not-found"/>
                            </Stack>
                        </QueryClientProvider>
                    </ThemeProvider>
             
                   
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
