import React, { useEffect, useState } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText, ThemedView } from '@/components/ui/themed';
import {getStorageItemAsync, setStorageItemAsync} from "@/libs/secureStore";
import ProgressBar from './ProgressBar';
import ErrorBar from './ErrorBar';
import { Colors } from '@/constants/Colors';

interface Props {
  onClose?: () => void; // facultatif, au cas où tu veux réagir à la fermeture
  nbStepsToWin?: number; // nombre d'étapes pour gagner
}

export default function TutorialModal({ onClose, nbStepsToWin=1 }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const skip = await getStorageItemAsync('skipTutorial');
      if (skip !== 'true') {
        setVisible(true);
      } else{
        onClose?.();
      }
    })();
  }, []);

  const handleClose = () => {
    setVisible(false);
    onClose?.();
  };

  const handleDisableForever = async () => {
    await setStorageItemAsync('skipTutorial', 'true');
    setVisible(false);
    onClose?.();
  };

  if (!visible) return null;

  return (
    <Modal transparent animationType="slide" visible={visible}>
      <View style={styles.modalOverlay}>
        <ThemedView style={styles.modalContent}>
          <ThemedText style={styles.title}>Comment capturer l’animal ?</ThemedText>
          <ProgressBar currentStep={1} maxSteps={nbStepsToWin}/>
          <ThemedText style={styles.text}>
            Choisissez l’action correcte en fonction du comportement de l’animal dans le temps imparti. Réagissez bien {nbStepsToWin} fois pour gagner !
          </ThemedText>
          <ErrorBar lives={2} totalLives={3}/>
          <ThemedText style={styles.text}>
            Attention ! Si vous ne réagissez pas correctement, vous perdez une vie. Si vous n'en avez plus, l'animal s’enfuit.
          </ThemedText>
          <TouchableOpacity onPress={handleClose} style={styles.button}>
            <ThemedText style={styles.buttonText}>J’ai compris !</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDisableForever} style={[styles.button, styles.disableButton]}>
            <ThemedText style={styles.buttonText}>Ne plus afficher</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    padding: 20,
    borderRadius: 20,
    width: '85%',
    alignItems: 'center',
    gap: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    textAlign: "justify",
  },
  button: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: Colors.light.success,
    width: '100%',
    alignItems: 'center',
  },
  disableButton: {
    backgroundColor: Colors.light.error,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
