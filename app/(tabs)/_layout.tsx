import {Redirect, Tabs} from 'expo-router';
import {TabBarIcon} from '@/components/navigation/TabBarIcon';
import {Colors} from '@/constants/Colors';
import {useColorScheme} from '@/hooks/useColorScheme';
import {useSafeAreaInsets} from "react-native-safe-area-context";

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const insets = useSafeAreaInsets();
    return <Redirect href="/register"/>;
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                headerShown: false,
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({color, focused}) => (
                        <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color}/>
                    ),
                }}
            />
            <Tabs.Screen
                name="encyclopedia"
                options={{
                    title: 'Encyclopedia',
                    tabBarIcon: ({color, focused}) => (
                        <TabBarIcon name={focused ? 'book' : 'book-outline'} color={color}/>
                    ),
                }}
            /><Tabs.Screen
            name="(profil)"
            options={{
                title: 'Profil',
                tabBarIcon: ({color, focused}) => (
                    <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color}/>
                ),
            }}
        />
        </Tabs>
    );
}
