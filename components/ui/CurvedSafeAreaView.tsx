import {SafeAreaView, StyleSheet, View} from "react-native";
import React, {ReactNode} from "react";
import {useThemeColor} from "@/hooks/useThemeColor";

interface CurvedSafeAreaViewProps {
    children: ReactNode;
    backgroundColor?: string;
    cornerRadius?: number;
}
export default function CurvedSafeAreaView({children, backgroundColor, cornerRadius = 30}: CurvedSafeAreaViewProps) {
    const _backgroundColor = useThemeColor({ light: backgroundColor, dark: backgroundColor }, 'background');

    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        content: {
            flex: 1,
            backgroundColor: _backgroundColor,
            borderTopLeftRadius: cornerRadius,
            borderTopRightRadius: cornerRadius,
            overflow: 'hidden',
        },
    });

    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]}>
            <View style={styles.content}>{children}</View>
        </SafeAreaView>
    );
}