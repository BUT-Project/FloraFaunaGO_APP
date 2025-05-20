import React from 'react';
import { Image, StyleSheet, ActivityIndicator, Text, TextStyle } from 'react-native';
import { SafeView, SafeViewProps } from './SafeView';
import { ThemedText } from './themed';
import { Colors } from '@/constants/Colors';

type LoadingProps = SafeViewProps & {
    text?: string;
    textStyle?: TextStyle;
};

const Loading: React.FC<LoadingProps> = (props) => {
    const { text, textStyle, style, ...rest } = props;
    return (
        <SafeView style={[styles.container, style]} {...rest}>
            <Image
                source={require("@/assets/images/logo_FFGO.png")}
                style={styles.logo}
                resizeMode="contain"
            />
            <ActivityIndicator size="large" color={Colors.light.tint}/>
            {text ? (
                <ThemedText style={[styles.text, textStyle]}>{text}</ThemedText>
            ) : null}
        </SafeView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 24,
    },
    text: {
        marginTop: 16,
        fontSize: 16,
        color: Colors.light.tint,
        textAlign: 'center',
    },
});

export default Loading;
