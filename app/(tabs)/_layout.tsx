import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import { TouchableOpacity,StyleSheet } from 'react-native';
import {ThemedText} from "@/components/ui/themed/ThemedText";

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const insets = useSafeAreaInsets();
    const [isCapture, setIsCapture] = React.useState(false)
    const takePhoto = async () => {
        alert("Prise de la photo")
    };

    // return <Redirect href="/(auth)/register"/>;

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                headerShown: false,
            }}>
            <Tabs.Screen
                name="(profil)"
                options={{
                    title: 'Profil',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
                    ),
                }}
                listeners={{
                    tabPress: () => setIsCapture(false),
                }}
            />
            <Tabs.Screen
                name="index"
                listeners={{
                    tabPress: () => {
                        if (!isCapture) {
                            setIsCapture(true);
                        }
                        else {
                            takePhoto();
                        }
                    }
                }}
                options={{
                    tabBarButton: (props) => (
                        <TouchableOpacity {...props} style={[styles.iconContainer, { paddingTop: isCapture? 3 : 6}]}>
                            <TabBarIcon
                                name={isCapture ? "ellipse-outline" : "home-outline"}
                                size={ isCapture ? 50 : 26}
                                color={Colors.light.icon}
                            />
                            {!isCapture &&
                                <ThemedText style={styles.captureText} >Capture</ThemedText>
                            }
                        </TouchableOpacity>
                    ),
                    tabBarStyle: { backgroundColor: 'transparent' },
                }}
            />
            <Tabs.Screen
                name="(encyclopedia)"
                options={{
                    title: 'Encyclopedia',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'book' : 'book-outline'} color={color} />
                    ),
                }}
                listeners={{
                    tabPress: () => setIsCapture(false),
                }}
            />

        </Tabs>
    );
}

const styles = StyleSheet.create({
    iconContainer: {
        flex:1,
        flexDirection:"column",
        alignItems: 'center',
        margin:0,
    },
    captureText: {
        fontSize: 10,
        color: Colors.light.icon,
        marginTop: 2,
    },
});
