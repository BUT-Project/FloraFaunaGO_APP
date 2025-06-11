import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import FaceOffGame,{NB_LIVES,NB_STEPS,MAX_RESPONSE_TIME} from '@/components/faceOffGame/FaceOffGame';
import * as actionsModule from "@/components/faceOffGame/game/actions";

jest.mock('@/components/faceOffGame/Tutorial', () => {
const React = require("react")
  return ({ onClose }: { onClose?: () => void }) => {
    React.useEffect(() => {
      onClose?.(); 
    }, []);
    return null;
  };
});
jest.mock('@/components/faceOffGame/game/actions', () => ({
    ...jest.requireActual('@/components/faceOffGame/game/actions'),
    getRandomAnimalAction: jest.fn(),
}));

const mockAnimalAction = actionsModule.AnimalActions.Attack

describe('FaceOffGame', () => {
  beforeAll(()=>jest.useFakeTimers())
  beforeEach(() => {
      jest.clearAllMocks();
      (actionsModule.getRandomAnimalAction as jest.Mock).mockReturnValue(mockAnimalAction);
  });
  afterAll(() => jest.useRealTimers());
  afterEach(() => {
    jest.clearAllTimers();
  });
  it('affiche la vue avec tout ces composant et commence une partie', async () => {
    const onResult = jest.fn();
    const onCancel = jest.fn();

    const { queryByTestId } = render(
      <FaceOffGame animalPhoto="photo-url" onResult={onResult} onCancel={onCancel} />
    );

    Object.values(actionsModule.PlayerActions).map((action)=>{
        expect(queryByTestId(`${action.label}.Button`)).toBeTruthy()
    });
    
    expect(queryByTestId('Flee.Button')).toBeTruthy();
    expect(queryByTestId("Result.Message")).toBeNull();
    expect(queryByTestId("AnimalAction.Message")).toBeTruthy()
  });

  it("choisir sur la mauvaise action affiche un message",async()=>{
        const { getByTestId } = render(
        <FaceOffGame animalPhoto="photo-url" onResult={()=> {}} onCancel={()=>{}} />
        );

        const wrongAction = actionsModule.PlayerActions.takePhoto        
        const wrongButtonAction = getByTestId(`${wrongAction.label}.Button`)
        await act(async()=>{
            fireEvent.press(wrongButtonAction)
        })
        expect(getByTestId('Result.Message')).toBeTruthy();
  });
  
   it('appuyer sur le bouton fuir appelle onCancel', async () => {
        const onCancel = jest.fn();
        const { getByTestId } = render(
        <FaceOffGame animalPhoto="photo-url" onResult={()=> {}} onCancel={onCancel} />
        );

        const fleeButton = getByTestId('Flee.Button');
        
        await act(async()=>{
            fireEvent.press(fleeButton)
        })
        expect(onCancel).toHaveBeenCalled();
  });


   it('affiche un message lorsque le temps imparti pour répondre est écoulé', async () => {
        const { getByTestId } = render(
            <FaceOffGame animalPhoto="photo-url" onResult={()=>{}} onCancel={() => {}} />
        );

        for (let i = 0; i <= MAX_RESPONSE_TIME; i += 100) {
          act(() => {
            jest.advanceTimersByTime(100);
          });
          await Promise.resolve(); // Force React à finir le cycle de rendu
        }


        expect(getByTestId('Result.Message')).toBeTruthy()

    });

  it('termine la partie avec succès après 3 bonnes réponses', async () => {
    const onResult = jest.fn();

    const { getByTestId } = render(
      <FaceOffGame animalPhoto="photo-url" onResult={onResult} onCancel={() => {}} />
    );

    const dodgeButton = getByTestId(`${actionsModule.PlayerActions.dodge.label}.Button`);

    await act(async () => {
      for (let i = 0; i < 3; i++) {
        fireEvent.press(dodgeButton);
        jest.advanceTimersByTime(2500);
      }
    });

    expect(onResult).toHaveBeenCalledWith(true);
  });
});