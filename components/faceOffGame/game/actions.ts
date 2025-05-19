
import { AnimalActionData, AnimalActionType, PlayerActionData, PlayerActionType } from './types';

export const AnimalActions: Record<AnimalActionType, AnimalActionData> = {
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

export const PlayerActions: Record<PlayerActionType, PlayerActionData> = {
  [PlayerActionType.Wait]: new PlayerActionData(
    PlayerActionType.Wait,
    "Attendre",
    "hourglass",
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

export const getRandomAnimalAction = (): AnimalActionData => {
  const values = Object.values(AnimalActions);
  const index = Math.floor(Math.random() * values.length);
  return values[index];
};