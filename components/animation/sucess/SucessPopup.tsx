import { SuccessStore } from '@/context/zustand/strore/useSuccessStore';
import React, { useEffect, useRef } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Animated, useAnimatedValue } from 'react-native';

interface SuccessPopupProps {
    message: String;
    visible: boolean;
}

export default function SuccessPopup({ message, visible }: SuccessPopupProps) {
    const translateY = useRef(new Animated.Value(-200)).current; // Position initiale au-dessus de l'écran
    const { setisVisible, isVisibile } = SuccessStore();
    useEffect(() => {
        if (visible) {
            // Animation de descente
            Animated.timing(translateY, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }).start();
        } else {
            // Animation de remontée
            Animated.timing(translateY, {
                toValue: -300,
                duration: 800,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    useEffect(() => {
        setTimeout(() => {
            setisVisible(false);
        }, 7000);
        return; 
    }, [isVisibile]);

    return (
        <Modal transparent animationType="none" visible={visible}>
                <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>                
                    <View style={styles.popup}>
                    <Text style={styles.message}>{message}</Text>
                </View>
            </Animated.View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: 'center',
        alignItems: 'center',
    },
    popup: {
        backgroundColor: 'whitesmoke',
        width: '80%',
        padding: 20,
        borderWidth: 8,
        borderColor: 'rgb(125, 255, 125)',
        borderRadius: 15,
        alignItems: 'center',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5
    },
    message: {
        color: 'rgb(141, 228, 255)',
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
});


