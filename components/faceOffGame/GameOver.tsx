// components/capture/GameOverModal.tsx
import React from 'react';
import { Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText, ThemedView } from '@/components/ui/themed';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const GameOverModal = ({ visible, onClose }: Props) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <ThemedView style={styles.overlay}>
        <ThemedView style={styles.container}>
          <Ionicons name="close-circle-outline" size={64} color={Colors.light.error}/>
          <ThemedText style={styles.title}>Game Over</ThemedText>
          <ThemedText style={styles.subtitle}>L’animal s'est enfui...</ThemedText>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <ThemedText style={styles.buttonText}>Continuer</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 30,
    borderRadius: 20,
    gap: 15,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
  },
  button: {
    backgroundColor: Colors.light.error,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
  },
});

export default GameOverModal;