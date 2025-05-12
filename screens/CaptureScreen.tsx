// FaceOffGame.tsx
import React, { useState, useEffect } from 'react';
import { ImageBackground,View, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedView,ThemedText } from '@/components/ui/themed';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  animalPhoto: string; // URI de la photo
  onResult: (success: boolean) => void;
  onCancel: () => void;
};

enum PlayerActionType {
    Wait = 'wait',
    Dodge = 'dodge',
    TakePhoto = 'takePhoto',
};

enum AnimalActionType {
    Observe = 'observe',
    Charge = 'charge',
    Flee = 'flee',
};

class AnimalActionData {
    constructor(
      public type: AnimalActionType,
      public label: string,
      public icon: keyof typeof Ionicons.glyphMap,
      public correctResponses: PlayerActionType[]
    ) {}
  
    isCorrect(playerAction: PlayerActionType) {
      return this.correctResponses.includes(playerAction);
    }
};
  
class PlayerActionData {
    constructor(
        public type: PlayerActionType,
        public label: string,
        public icon: keyof typeof Ionicons.glyphMap,
        public color: string,
        public successMessage: string,
        public failureMessage: string
    ) {}
};

const AnimalActions: Record<AnimalActionType, AnimalActionData> = {
    [AnimalActionType.Observe]: new AnimalActionData(
      AnimalActionType.Observe,
      "vous observe curieusement",
      "eye",
      [PlayerActionType.Wait, PlayerActionType.TakePhoto]
    ),
    [AnimalActionType.Charge]: new AnimalActionData(
      AnimalActionType.Charge,
      "fonce sur vous !",
      "alert",
      [PlayerActionType.Dodge]
    ),
    [AnimalActionType.Flee]: new AnimalActionData(
      AnimalActionType.Flee,
      "tente de s’enfuir !",
      "exit-outline",
      [PlayerActionType.TakePhoto]
    ),
};

const PlayerActions: Record<PlayerActionType, PlayerActionData> = {
    [PlayerActionType.Wait]: new PlayerActionData(
      PlayerActionType.Wait,
      "Attendre",
      "hourglass",       // par exemple MaterialCommunityIcons
      "#3498db",
      "Vous avez attendu calmement. Bonne décision.",
      "Vous avez attendu, mais ce n’était pas la bonne réaction."
    ),
    [PlayerActionType.Dodge]: new PlayerActionData(
      PlayerActionType.Dodge,
      "Esquiver",
      "accessibility-outline",
      "#e67e22",
      "Belle esquive ! Vous évitez l’animal.",
      "L’esquive n’était pas nécessaire, dommage."
    ),
    [PlayerActionType.TakePhoto]: new PlayerActionData(
      PlayerActionType.TakePhoto,
      "Prendre une photo",
      "camera",
      "#2ecc71",
      "Photo prise au bon moment !",
      "Trop tard ou mal choisi, pas de photo..."
    ),
  };

const NB_LIVES = 3;
const NB_ROUNDS = 3;

const getRandomAnimalAction = (): AnimalActionData => {
    const values = Object.values(AnimalActions);
    const index = Math.floor(Math.random() * values.length);
    return values[index];
};
export default function CaptureScreen({ animalPhoto, onResult, onCancel }: Props) {
    const [currentRound, setCurrentRound] = useState(0);
    const [lives, setLives] = useState(NB_LIVES);
    const [animalAction, setAnimalAction] = useState<AnimalActionData>();
  
    useEffect(() => {
      if (currentRound < NB_ROUNDS && lives > 0) {
        setAnimalAction(getRandomAnimalAction());
      } else {
        onResult(lives > 0);
      }
    }, [currentRound, lives]);
  
    const handleChoice = (choice: PlayerActionType) => {
      const isCorrect = animalAction?.isCorrect(choice);
      if (!isCorrect) {
        setLives(prevLives => {
          const updatedLives = prevLives - 1;
          if (updatedLives <= 0) {
            onResult(false);
          }
          return updatedLives;
        });
      }
      setCurrentRound(prev => prev + 1);
    };
  
    return (
        <ImageBackground source={{ uri: animalPhoto }} style={styles.container}>
            <ThemedView style={styles.overlay}>
            <View style={styles.topBar}>
                <TouchableOpacity style={styles.fleeButton} onPress={onCancel}>
                    <Ionicons name="chevron-back" size={30} color="#fff" />
                    <ThemedText style={styles.topText}>Fuir</ThemedText>
                </TouchableOpacity>
                <ThemedText style={styles.topText}>Tour {currentRound + 1}/{NB_ROUNDS}</ThemedText>
                <View style={styles.livesContainer}>
                    {[...Array(NB_LIVES)].map((_, index) => (
                    <Ionicons
                        key={index}
                        name={index < lives ? 'heart' : 'heart-outline'}
                        size={24}
                        color="red"
                    />
                    ))}
                </View>
            </View>
            <View style={styles.bottom}>
                <ThemedText style={styles.animalAction}>L’animal {animalAction?.label}...</ThemedText>
                <ThemedView style={styles.buttons}>
                    {Object.values(PlayerActions).map((action) => (
                    <TouchableOpacity key={action.type} onPress={() => handleChoice(action.type)}>
                        <ThemedView style={styles.button}>
                        <ThemedText>{action.label}</ThemedText>
                        <Ionicons name={action.icon} color={action.color} size={30} />
                        </ThemedView>
                    </TouchableOpacity>
                    ))}
                </ThemedView>
            </View>
            </ThemedView>
        </ImageBackground>
    );
  }
  
  const styles = StyleSheet.create({
    container: { flex: 1 },
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.3)",
    },
    topBar: {
      width: '100%',
      position: 'absolute',
      top: 20,
      paddingHorizontal: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    topText: {
      fontSize: 22,
      color: '#fff',
    },
    livesContainer: {
      flexDirection: 'row',
      gap: 5,
    },
    animalAction: {
      fontSize: 20,
      fontStyle: 'italic',
      color: '#fff',
      textAlign: 'center',
    },
    bottom:{
        width: '100%',
        position: 'absolute',
        bottom: 0,
        gap: 10,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
      },
    button: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fleeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    }
  });