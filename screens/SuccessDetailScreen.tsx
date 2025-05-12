import { ThemedView } from "@/components/ui/themed/ThemedView";
import { ThemedText } from "@/components/ui/themed/ThemedText";
import {Success} from "@/model/domain/Success";
import {Modal, StyleSheet, TouchableOpacity} from "react-native";
import {ScrollView} from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

interface SucessDetailScreenProps {
    visible: boolean;
    onClose: () => void;
    sucess: Success;
}

export default function SuccessDetailScreen( { visible, onClose, sucess }: SucessDetailScreenProps) {
    return (
        <Modal animationType="slide" visible={visible} transparent={true} onRequestClose={onClose}>
            <TouchableOpacity style={styles.overlay} onPress={onClose}>
                <ThemedView style={styles.container}>

                    <ScrollView>
                        <ThemedText type="title" style={styles.title}>
                            {sucess.nom}
                        </ThemedText>

                        <ThemedText style={styles.description}>
                            {sucess.description}
                        </ThemedText>

                        <ThemedView style={styles.progressContainer}>
                            <ThemedText style={styles.progressText}>
                                Avancement : {Number((sucess.actualVal/sucess.objectif * 100).toFixed(2))}%
                            </ThemedText>
                            <ThemedView style={styles.progressBar}>
                                <ThemedView
                                    style={[
                                        styles.progressFill,
                                        { width: `${Number((sucess.actualVal/sucess.objectif * 100).toFixed(2))}%` }                                    ]}
                                />
                            </ThemedView>
                        </ThemedView>
                    </ScrollView>
                </ThemedView>
            </TouchableOpacity>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0)",
        justifyContent: "flex-end",
        alignItems: "flex-end",
    },
    container: {
        width: "100%",
        borderRadius: 12,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 3.84,
        elevation: 5,
    },
    closeButtonColor:{
        color:"#808080"
    },
    closeButton: {
        alignSelf: "flex-end"
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
        textAlign: "center",
    },
    description: {
        fontSize: 16,
        marginBottom: 16,
        textAlign: "justify",
    },
    progressContainer: {
        width: "100%",
        marginTop: 16,
    },
    progressText: {
        fontSize: 16,
        marginBottom: 8,
    },
    progressBar: {
        height: 10,
        backgroundColor: "#ddd",
        borderRadius: 5,
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        backgroundColor: "#4caf50",
    },
});