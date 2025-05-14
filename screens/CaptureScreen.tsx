// FaceOffGame.tsx
import React, { useState, useEffect, useRef } from 'react';
import { ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedView,ThemedText } from '@/components/ui/themed';
import { Ionicons } from '@expo/vector-icons';
import { SafeView } from '@/components/ui/SafeView';
import { 
  Tutorial,
  ProgressBar,
  ErrorBar,
  TimeBar,
  GameOver,
  FeedbackMessageToast,
  FeedbackMessage
} from '@/components/capture';

interface Props {
  animalPhoto: string; 
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
    [PlayerActionType.TakePhoto]: new PlayerActionData(
      PlayerActionType.TakePhoto,
      "Prendre une photo",
      "camera",
      "#2ecc71",
      "Photo prise au bon moment !",
      "Trop tard ou mal choisi, pas de photo..."
    ),
    [PlayerActionType.Dodge]: new PlayerActionData(
      PlayerActionType.Dodge,
      "Esquiver",
      "accessibility-outline",
      "#e67e22",
      "Belle esquive ! Vous évitez l’animal.",
      "L’esquive n’était pas nécessaire, dommage."
    ),
  
};

const NB_LIVES = 3;
const NB_STEPS = 3;
const MAX_RESPONSE_TIME = 5000;
const DELAY_BETWEEN_ROUNDS = 2500;

const getRandomAnimalAction = (): AnimalActionData => {
    const values = Object.values(AnimalActions);
    const index = Math.floor(Math.random() * values.length);
    return values[index];
};
export default function CaptureScreen({ animalPhoto, onResult, onCancel }: Props) {
  const [step, setStep] = useState(0);
  const [lives, setLives] = useState(NB_LIVES);
  const [animalAction, setAnimalAction] = useState<AnimalActionData | null>();
  const [timeLeft, setTimeLeft] = useState(MAX_RESPONSE_TIME);
  const [feedbackMessage, setFeedbackMessage] = useState<FeedbackMessage | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if(step >= NB_STEPS) {
      onResult(true);
    }
  }, [step]);

  useEffect(() => {
    if (animalAction) {
      setTimeLeft(MAX_RESPONSE_TIME);
      // Start a new interval for the TimeBar
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            handleTimeout();
            return 0;
          }
          return prev - 100;
        });
      }, 100);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [animalAction]);


  const handleTimeout = () => {
    setAnimalAction(null);
    setFeedbackMessage({text:"Trop tard ! Vous avez hésité...", type: 'error'});
    setLives((prev) => prev - 1);
    startNextRoundDelay();
  };

  const handleChoice = (choice: PlayerActionType) => {
    if (!animalAction) return;

    const isCorrect = animalAction.isCorrect(choice);
    const text = isCorrect
      ? PlayerActions[choice].successMessage
      : PlayerActions[choice].failureMessage;
    const type = isCorrect ? 'success' : 'error';

    setAnimalAction(null);
    setFeedbackMessage({text, type});
    
    if (isCorrect) {
      setStep((prev) => prev + 1);
      setTimeout(() => {
       startNextRoundDelay();
      }, DELAY_BETWEEN_ROUNDS); 
    } else {
      setLives((prev) => prev - 1);
      startNextRoundDelay();
    }
  };
  
  const onClose = () => {
    setAnimalAction(getRandomAnimalAction());
  };

  const startNextRoundDelay = () => {
    if(lives <= 0) return;
    setTimeout(() => {
      setFeedbackMessage(null);
      setAnimalAction(getRandomAnimalAction());
    }, DELAY_BETWEEN_ROUNDS); 
  };
  return (
      <SafeView disableTopInset>
          <GameOver visible={lives <= 0} onClose={() => onResult(false)} />
          <Tutorial nbStepsToWin={NB_STEPS} onClose={() => onClose()}/>
          <ImageBackground source={{ uri: animalPhoto }} style={styles.container}>
            <ThemedView style={styles.overlay}>
            <ThemedView style={styles.topBar}>
                <TouchableOpacity style={styles.fleeButton} onPress={onCancel}>
                    <Ionicons name="chevron-back" size={30} color="#fff" />
                    <ThemedText style={styles.topText}>Fuir</ThemedText>
                </TouchableOpacity>
                <ProgressBar currentStep={step} maxSteps={NB_STEPS}/>
                <ErrorBar lives={lives} totalLives={NB_LIVES} style={styles.errorBar}/>
            </ThemedView>
            <ThemedView style={styles.bottom}>
                {feedbackMessage && (
                    <FeedbackMessageToast message={feedbackMessage}/>
                )}
                {animalAction && (
                  <ThemedText style={styles.animalAction}>L’animal {animalAction?.label}... </ThemedText> 
                )}
                <TimeBar timeLeft={timeLeft} maxTime={MAX_RESPONSE_TIME} />
                <ThemedView style={styles.buttons}>
                    {Object.values(PlayerActions).map((action) => (
                    <TouchableOpacity key={action.type} onPress={() => handleChoice(action.type)}>
                        <ThemedView style={styles.button}>
                        <ThemedText style={{color:action.color}}>{action.label}</ThemedText>
                        <Ionicons name={action.icon} color={action.color} size={30} />
                        </ThemedView>
                    </TouchableOpacity>
                    ))}
                </ThemedView>
            </ThemedView>
            </ThemedView>
        </ImageBackground>
      </SafeView>  
    );
  }
  
  const styles = StyleSheet.create({
    container: { flex: 1 },
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.3)",
    },
    topBar: {
      backgroundColor:"transparent",
      width: '100%',
      position: 'absolute',
      top: 20,
      paddingHorizontal: 10,
      flexDirection: 'row',
      justifyContent:"center",
      alignItems: 'center',
    },
    topText: {
      fontSize: 22,
      color: '#fff',
    },
    animalAction: {
      fontSize: 20,
      fontStyle: 'italic',
      color: '#fff',
      textAlign: 'center',
      marginBottom: 10,
    },
    bottom:{
      backgroundColor:"transparent",
      width: '100%',
      position: 'absolute',
      bottom: 0,
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
        position: 'absolute',
        left: 0,
    },
    errorBar:{
      position: 'absolute',
      right: 0,
    }
  });