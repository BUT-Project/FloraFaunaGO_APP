import { Ionicons } from '@expo/vector-icons';

export enum PlayerActionType {
  Wait = 'wait',
  Dodge = 'dodge',
  TakePhoto = 'takePhoto',
};

export enum AnimalActionType {
  Observe = 'observe',
  Charge = 'charge',
  Flee = 'flee',
};

export class AnimalActionData {
  constructor(
    public type: AnimalActionType,
    public label: string,
    public icon: string,
    public correctResponses: PlayerActionType[]
  ) {}

  isCorrect(playerAction: PlayerActionType) {
    return this.correctResponses.includes(playerAction);
  }
}

export class PlayerActionData {
  constructor(
    public type: PlayerActionType,
    public label: string,
    public icon: keyof typeof Ionicons.glyphMap,
    public color: string,
    public successMessage: string,
    public failureMessage: string
  ) {}
}

export interface FeedbackMessage {
  text: string;
  type: 'success' | 'error' | 'info';
}