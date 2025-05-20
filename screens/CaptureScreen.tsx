import React from 'react';
import { SafeView } from '@/components/ui/SafeView';
import { FaceOffGame} from '@/components/faceOffGame';
import { TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ui/themed';

interface Props {
  animalPhoto?: string | null; 
  onResult: (success: boolean) => void;
  onCancel: () => void;
};

export default function CaptureScreen({ animalPhoto, onResult, onCancel }: Props) {
     if(!animalPhoto) {
        return (
            <SafeView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ThemedText>Image introuvable </ThemedText>
                <TouchableOpacity onPress={() => onCancel}>
                    <ThemedText>Retour</ThemedText>
                </TouchableOpacity>
            </SafeView>
        );
    }
  return (
      <SafeView style={{flex: 1}}>
          <FaceOffGame
              animalPhoto={animalPhoto}
              onResult={onResult}
              onCancel={onCancel}
          />
      </SafeView>  
    );
}