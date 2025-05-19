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

// Prevent the splash screens from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
    const queryClient = new QueryClient();
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });
    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                        <QueryClientProvider client={queryClient}>
                            <Stack initialRouteName="(auth)" >
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
