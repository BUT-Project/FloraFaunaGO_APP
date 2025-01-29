import {Colors} from "@/constants/Colors";
import {Tabs} from "expo-router";
import {TabBarIcon} from "@/components/navigation/TabBarIcon";
import {StyleSheet, Text, TouchableOpacity} from "react-native";
import {ThemedText} from "@/components/ui/themed/ThemedText";
import Animated, {useAnimatedStyle, withSpring} from "react-native-reanimated";
import {useColorScheme} from "@/hooks/useColorScheme";
import {useContext, useEffect, useState} from "react";
import {useAuthStore} from "@/context/zustand/strore/AuthStore";
import {UploadContext} from "@/context/UploadContext";

export default function RootNavigation() {

    const colorScheme = useColorScheme();
    const [isCapture, setIsCapture] = useState(false);

    const takePhoto = async () => {
        alert("Prise de la photo");
    };
    const postState = useContext(UploadContext);

    const badgeStyle = useAnimatedStyle(() => {
        return {
            transform: [{scale: withSpring(!postState?.uploading ? 0 : 1)}],
        };
    }, [postState?.uploading]);
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
                name="(home)"
                listeners={{
                    tabPress: () => {
                        if (!isCapture) {
                            setIsCapture(true);
                        } else {
                            takePhoto();
                        }
                    }
                }}
                options={{
                    tabBarButton: (props) => (
                        <TouchableOpacity {...props} style={[styles.iconContainer, { paddingTop: isCapture ? 3 : 6 }]}>
                            <TabBarIcon
                                name={isCapture ? "ellipse-outline" : "home-outline"}
                                size={isCapture ? 50 : 26}
                                color={Colors.light.icon}
                            />
                            {!isCapture && (
                                <ThemedText style={styles.captureText}>Capture</ThemedText>
                            )}
                        </TouchableOpacity>
                    ),
                    tabBarStyle: { backgroundColor: 'transparent' },
                }}
            />
            <Tabs.Screen
                name="(encyclopedia)"
                options={{
                    title: 'Encyclopedia',
                    tabBarIcon: ({color, focused}) => (
                        <Animated.View>
                            <TabBarIcon name={focused ? 'book' : 'book-outline'} color={color} />
                            <Animated.View
                                style={[
                                    styles.progressBadge,
                                    badgeStyle,
                                ]}
                            >
                                <Text style={styles.progressBadgeText}>new</Text>
                            </Animated.View>
                        </Animated.View>
                    ),
                }}
                listeners={{
                    tabPress: () => setIsCapture(false),
                }}
            />
        </Tabs>
    )
}

const styles = StyleSheet.create({
    progressBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        minWidth: 14,
        minHeight: 14,
        borderRadius: 10000,
        backgroundColor: 'rgb(26, 186, 210)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'grey',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
    },
    progressBadgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    iconContainer: {
        flex: 1,
        flexDirection: "column",
        alignItems: 'center',
        margin: 0,
    },
    captureText: {
        fontSize: 10,
        color: Colors.light.icon,
        marginTop: 2,
    },
});