import {Slot} from "expo-router";
import normalize from "@/components/ui/responsive/Normalize";
import {Image, StyleSheet} from "react-native";
import DismissKeyboard from "@/components/ui/DismissKeyboard";
import {ThemedView} from "@/components/ui/themed/ThemedView";
import {ThemedText} from "@/components/ui/themed/ThemedText";

export default function AuthLayout() {
    return (
        <DismissKeyboard>
            <ThemedView style={commonAuthStyles.container}>
                <ThemedText style={commonAuthStyles.versionText}>v0.2</ThemedText>
                <Image source={require("@/assets/images/logo_FFGO.png")} style={commonAuthStyles.imageLogo}/>
                <Slot initialRouteName="login"/>
            </ThemedView>
        </DismissKeyboard>
    );
}

export const commonAuthStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    versionText: {
        position: 'absolute',
        top: 40,
        right: 20,
        color: 'gray',
        fontWeight: 'bold',
        fontSize: normalize(17)
    },
    imageLogo: {
        width: normalize(324),
        height: normalize(162),
        resizeMode: "contain",
        marginBottom: normalize(40),
    },
});