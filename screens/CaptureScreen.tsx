// FaceOffGame.tsx
import React, { useState, useEffect, useRef } from 'react';
import { SafeView } from '@/components/ui/SafeView';
import { FaceOffGame} from '@/components/faceOffGame';

interface Props {
  animalPhoto: string; 
  onResult: (success: boolean) => void;
  onCancel: () => void;
};

export default function CaptureScreen({ animalPhoto, onResult, onCancel }: Props) {
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