import { SuccessStore } from '@/context/zustand/strore/useSuccessStore';
import React, { useEffect, useRef } from 'react';
import { View, Modal, StyleSheet, Animated, Pressable } from 'react-native';
import { ThemedText } from '@/components/ui/themed/ThemedText';
import { ThemedView } from '@/components/ui/themed/ThemedView';

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
        }, 40000);
        return; 
    }, [isVisibile]);

    return (
        <Modal pointerEvents="box-none" transparent animationType="none" visible={visible}>
            <Pressable onPress={() => setisVisible(false)} style={styles.press}>
                <Animated.View 
                pointerEvents="box-none"          
                style={[styles.container, { transform: [{ translateY }] }]}>                
                    <ThemedView style={styles.popup}>
                        <ThemedText style={styles.message}>{message}</ThemedText>
                    </ThemedView>
            </Animated.View>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    press: {
        flex: 1,
    },
    container: {
        flex: 1,
        width: '100%',
        alignSelf: 'center',
        alignItems: 'center',
    },
    popup: {
        width: '100%',
        padding: 20,
        borderBottomWidth: 2,
  
        alignItems: 'center',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5
    },
    message: {
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
    },
});


