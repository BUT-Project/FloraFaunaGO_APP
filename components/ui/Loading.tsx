import React from 'react';
import { Image, StyleSheet, ActivityIndicator, TextStyle, useColorScheme } from 'react-native';
import { SafeView, SafeViewProps } from './SafeView';
import { ThemedText } from './themed';
import { Colors } from '@/constants/Colors';

type LoadingProps = SafeViewProps & {
    text?: string;
    textStyle?: TextStyle;
};

const Loading: React.FC<LoadingProps> = (props) => {
    const { text, textStyle, style, ...rest } = props;
    const colorScheme = useColorScheme() ?? "light";
    const theme  = Colors[colorScheme]
    return (
        <SafeView style={[styles.container, style]} {...rest}>
            <Image
                source={require("@/assets/images/logo_FFGO.png")}
                style={styles.logo}
                resizeMode="contain"
            />
            <ActivityIndicator testID="Loading.Indicator" size="large" color={theme.tint}/>
            {text ? (
                <ThemedText testID="Loading.Text" style={[styles.text,{color:theme.tint},textStyle,]}>{text}</ThemedText>
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
        textAlign: 'center',
    },
});

export default Loading;
