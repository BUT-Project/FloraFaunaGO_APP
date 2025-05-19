// FaceOffGame.tsx
import React, { useState, useEffect, useRef } from 'react';
import { ImageBackground, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { ThemedView,ThemedText } from '@/components/ui/themed';
import { Ionicons } from '@expo/vector-icons';
import TutorialModal from './Tutorial';
import GameOverModal from './GameOver';
import ProgressBar from './ProgressBar';
import ErrorBar from './ErrorBar';
import TimeBar from './TimeBar';
import FeedbackMessageToast from './FeebackMessage';
import { AnimalActionData, PlayerActionType, FeedbackMessage } from './game/types';
import { PlayerActions,getRandomAnimalAction } from './game/actions';

interface Props {
  animalPhoto: string; 
  onResult: (success: boolean) => void;
  onCancel: () => void;
};

const NB_LIVES = 3;
const NB_STEPS = 3;
const MAX_RESPONSE_TIME = 4500;
const DELAY_BETWEEN_ROUNDS = 2500;

const FaceOffGame = ({ animalPhoto, onResult, onCancel }: Props) => {
  const [step, setStep] = useState(0);
  const [lives, setLives] = useState(NB_LIVES);
  const [animalAction, setAnimalAction] = useState<AnimalActionData | null>();
  const [timeLeft, setTimeLeft] = useState(MAX_RESPONSE_TIME);
  const [feedbackMessage, setFeedbackMessage] = useState<FeedbackMessage | null>(null);
    
  const [isWaitingForNextRound, setIsWaitingForNextRound] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const nextRoundTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        startNextRoundDelay();
    } else {
        setLives((prev) => prev - 1);
        startNextRoundDelay();
    }
  };
  
  const onClose = () => setAnimalAction(getRandomAnimalAction());


    const startNextRoundDelay = () => {
        if (lives <= 0) return;

        setIsWaitingForNextRound(true); 

        if (nextRoundTimeoutRef.current) {
            clearTimeout(nextRoundTimeoutRef.current);
        }
        nextRoundTimeoutRef.current = setTimeout(() => {
            setFeedbackMessage(null);
            setAnimalAction(getRandomAnimalAction());
            setIsWaitingForNextRound(false); 
        }, DELAY_BETWEEN_ROUNDS);
    };

    // Permet de reprendre le round suivant immédiatement
    const handleResumeTimeBetweenRound = () => {
        console.log("handleResumeTimeBetweenRound", isWaitingForNextRound);
        if (!isWaitingForNextRound) return; 
        if (nextRoundTimeoutRef.current) {
            clearTimeout(nextRoundTimeoutRef.current);
            nextRoundTimeoutRef.current = null;
        }
        setFeedbackMessage(null);
        setAnimalAction(getRandomAnimalAction());
        setIsWaitingForNextRound(false); 
    };

  useEffect(() => {
    return () => {
      if (nextRoundTimeoutRef.current) {
        clearTimeout(nextRoundTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
        <GameOverModal visible={lives <= 0} onClose={() => onResult(false)} />
        <TutorialModal nbStepsToWin={NB_STEPS} onClose={() => onClose()}/>
        <ImageBackground source={{ uri: animalPhoto }} style={styles.container}>
            <TouchableWithoutFeedback onPress={handleResumeTimeBetweenRound}>
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
                            <FeedbackMessageToast message={{text:`L’animal ${animalAction.label}`, icon:animalAction.icon, type: 'info'}}/>
                        )}
                        <TimeBar timeLeft={timeLeft} maxTime={MAX_RESPONSE_TIME} />
                    </ThemedView>
                </ThemedView>
            </TouchableWithoutFeedback>
        </ImageBackground>
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
      </>  
    );
}
  
const styles = StyleSheet.create({
    container: { flex: 1 },
    overlay: {
      flex: 1,
      backgroundColor: "transparent",
    },
    topBar: {
      backgroundColor:"transparent",
      width: '100%',
      position: 'absolute',
      top: 15,
      paddingHorizontal: 15,
      flexDirection: 'row',
      justifyContent:"center",
      alignItems: 'center',
      
    },
    topText: {
      fontSize: 20,
      color: '#fff',
    },
    bottom:{
      backgroundColor:"transparent",
      width: '100%',
      position: 'absolute',
      bottom: 0,
    },
    buttons: {
        height:70,
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
        alignSelf:"center",
        position: 'absolute',
        left: 0,
    },
    errorBar:{
      position: 'absolute',
      alignSelf: 'center',
      right: 0,
    }
});

export default FaceOffGame;