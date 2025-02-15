import React, {useState} from 'react';
import {Dimensions, Modal, Pressable, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {ThemedView} from '@/components/ui/themed/ThemedView';
import {Ionicons} from '@expo/vector-icons';
import {ThemedText} from '../ui/themed/ThemedText';

const { width } = Dimensions.get('window');

export type ExtendableTextProps = { 
    text: string,
    textStyle: any,
    style: any
};

export function ExtendableText({ text, textStyle, style }: ExtendableTextProps) {
    const [isExtended, setIsExtended] = useState(false);
    

    return (
        <>
            <TouchableOpacity style={style} onPress={() => setIsExtended(true)}>
               <ThemedText style={textStyle}>{text}</ThemedText>
               <ThemedView style={styles.icon}>
                    <Ionicons name={'chevron-forward'} size={30} color={'#fff'}/>
               </ThemedView>
            </TouchableOpacity>
            <Modal animationType="fade" transparent={true} visible={isExtended}>
                <ThemedView style={styles.modal}>
                    <Pressable style={styles.closeButton} onPress={() => setIsExtended(false)}>
                        <Ionicons name={'close'} size={30} color={'#fff'} />
                    </Pressable>
                    <ThemedView style={[style,styles.modalContent]}>
                        <ScrollView  contentContainerStyle={styles.scrollView}>
                            <ThemedText style={textStyle}>Description :</ThemedText>
                            <ThemedText style={[textStyle,styles.modalText]}>{text}</ThemedText>
                        </ScrollView>
                    </ThemedView>
                </ThemedView>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    icon:{
        position:"absolute",
        bottom:0,
        right:0,
        padding:5,
        backgroundColor:'rgba(0, 0, 0, 0.5)',
    },
    modal: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Ajoute une teinte semi-transparente
        paddingHorizontal:20,
    },
    modalContent: {
        width: width - 40, 
        maxHeight:"60%",
        borderRadius: 15,
        overflow: 'hidden',
    },
    scrollView:{
        padding:5,
        gap:10,
    },
    modalText:{
        textAlign:"justify",
    },
    closeButton:{
        alignSelf:"flex-end",
        padding: 5, 
        borderRadius: 5, 
    }
});