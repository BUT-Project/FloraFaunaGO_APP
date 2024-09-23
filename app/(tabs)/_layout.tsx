import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { TouchableOpacity,StyleSheet } from 'react-native';
import {ThemedText} from "@/components/ui/themed/ThemedText";

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const [isCapture, setIsCapture] = React.useState(false)
    const takePhoto = async () => {
        alert("Prise de la photo")
    };
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,

      }}>
        <Tabs.Screen
            name="profil"
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
                    <TouchableOpacity {...props} style={[styles.iconContainer, { padding: isCapture ? 3 : 5}]}>

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
            name="encyclopedia"
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
        alignItems: 'center',
        height: '100%',
    },
    captureText: {
        fontSize: 10,
        color: Colors.light.icon,
        marginTop: 2,
    },
});