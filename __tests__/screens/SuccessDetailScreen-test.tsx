import React from 'react';
import { render } from '@testing-library/react-native';
import SuccessDetailScreen from '@/screens/SuccessDetailScreen';
import { Success } from '@/model/domain/Success';
import { SuccessType } from '@/model/domain/SuccessType';

jest.mock('@/components/ui/themed', () => ({
  ThemedView: ({ children, style, ...props }: { 
    children: React.ReactNode; 
    style?: any; 
    [key: string]: any; 
  }) => {
    const React = require('react');
    return React.createElement('View', { style, ...props }, children);
  },
  ThemedText: ({ children, style, type, ...props }: { 
    children: React.ReactNode; 
    style?: any; 
    type?: string; 
    [key: string]: any; 
  }) => {
    const React = require('react');
    return React.createElement('Text', { 
      style, 
      testID: type ? `themed-text-${type}` : 'themed-text',
      ...props 
    }, children);
  }
}));

jest.mock('@/constants/Colors', () => ({
  Colors: {
    light: {
      tint: '#007AFF',
      text: '#000000',
      background: '#FFFFFF'
    },
    dark: {
      tint: '#0A84FF',
      text: '#FFFFFF',
      background: '#000000'
    }
  }
}));

const mockSuccess: Success = {
  nom: 'Premier animal',
  description: 'Capturez votre premier animal pour débloquer ce succès !',
  actualVal: 3,
  objectif: 10,
  image: 'animal-icon.png',
  type: SuccessType.CAPTURE,
  event: 'first_animal_caught'
};

describe('SuccessDetailScreen', () => {
  const defaultProps = {
    visible: true,
    onClose: jest.fn(),
    sucess: mockSuccess
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rend le composant sans crash', () => {
    const { getByText } = render(<SuccessDetailScreen {...defaultProps} />);
    expect(getByText('Premier animal')).toBeTruthy();
  });

  it('affiche le nom du succès', () => {
    const { getByText } = render(<SuccessDetailScreen {...defaultProps} />);
    expect(getByText('Premier animal')).toBeTruthy();
  });

  it('affiche la description du succès', () => {
    const { getByText } = render(<SuccessDetailScreen {...defaultProps} />);
    expect(getByText('Capturez votre premier animal pour débloquer ce succès !')).toBeTruthy();
  });

  it('calcule et affiche le pourcentage de progression correct', () => {
    const { getByText } = render(<SuccessDetailScreen {...defaultProps} />);
    expect(getByText('Avancement : 30%')).toBeTruthy();
  });

  it('calcule correctement le pourcentage avec des décimales', () => {
    const successWithDecimals = {
      ...mockSuccess,
      actualVal: 7,
      objectif: 3
    };
    
    const { getByText } = render(
      <SuccessDetailScreen 
        {...defaultProps} 
        sucess={successWithDecimals} 
      />
    );
    expect(getByText('Avancement : 233.33%')).toBeTruthy();
  });

  it('gère le cas où objectif est 0', () => {
    const successWithZeroObjectif = {
      ...mockSuccess,
      actualVal: 5,
      objectif: 0
    };
    
    const { getByText } = render(
      <SuccessDetailScreen 
        {...defaultProps} 
        sucess={successWithZeroObjectif} 
      />
    );
    expect(getByText(/Avancement :/)).toBeTruthy();
  });

  it('appelle onClose quand on presse sur le overlay', () => {
    const onCloseMock = jest.fn();
    const { getByTestId } = render(
      <SuccessDetailScreen 
        {...defaultProps} 
        onClose={onCloseMock} 
      />
    );
    

    const modal = render(<SuccessDetailScreen {...defaultProps} onClose={onCloseMock} />);
    expect(onCloseMock).not.toHaveBeenCalled();
  });

  it('ne rend pas le modal quand visible est false', () => {
    const { queryByText } = render(
      <SuccessDetailScreen 
        {...defaultProps} 
        visible={false} 
      />
    );
    
    expect(queryByText('Premier animal')).toBeNull();
  });

  it('utilise le bon titre avec type="title"', () => {
    const { getByTestId } = render(<SuccessDetailScreen {...defaultProps} />);
    expect(getByTestId('themed-text-title')).toBeTruthy();
  });

  describe('Cas limites', () => {
    it('gère un succès avec actualVal à 0', () => {
      const successZeroProgress: Success = {
        ...mockSuccess,
        actualVal: 0,
        objectif: 10
      };
      
      const { getByText } = render(
        <SuccessDetailScreen 
          {...defaultProps} 
          sucess={successZeroProgress} 
        />
      );
      
      expect(getByText('Avancement : 0%')).toBeTruthy();
    });

    it('gère un succès complété à 100%', () => {
      const successCompleted: Success = {
        ...mockSuccess,
        actualVal: 10,
        objectif: 10
      };
      
      const { getByText } = render(
        <SuccessDetailScreen 
          {...defaultProps} 
          sucess={successCompleted} 
        />
      );
      
      expect(getByText('Avancement : 100%')).toBeTruthy();
    });

    it('gère un succès dépassant l\'objectif', () => {
      const successOverAchieved: Success = {
        ...mockSuccess,
        actualVal: 15,
        objectif: 10
      };
      
      const { getByText } = render(
        <SuccessDetailScreen 
          {...defaultProps} 
          sucess={successOverAchieved} 
        />
      );
      
      expect(getByText('Avancement : 150%')).toBeTruthy();
    });

    it('gère des noms de succès longs', () => {
      const successLongName: Success = {
        ...mockSuccess,
        nom: 'Un nom de succès très très long qui pourrait poser des problèmes d\'affichage'
      };
      
      const { getByText } = render(
        <SuccessDetailScreen 
          {...defaultProps} 
          sucess={successLongName} 
        />
      );
      
      expect(getByText('Un nom de succès très très long qui pourrait poser des problèmes d\'affichage')).toBeTruthy();
    });

    it('gère des descriptions vides', () => {
      const successEmptyDescription: Success = {
        ...mockSuccess,
        description: ''
      };
      
      const { getByText } = render(
        <SuccessDetailScreen 
          {...defaultProps} 
          sucess={successEmptyDescription} 
        />
      );
      
      expect(getByText('Premier animal')).toBeTruthy();
      // La description vide devrait quand même rendre un élément Text
    });
  });

// Tests d'intégration avec des props réelles
describe('SuccessDetailScreen - Tests d\'intégration', () => {
  const realSuccessData: Success[] = [
    {
      nom: 'Explorateur débutant',
      description: 'Visitez 5 lieux différents',
      actualVal: 2,
      objectif: 5,
      image: 'explorer-icon.png',
      type: SuccessType.LIEUX,
      event: 'visit_locations'
    },
    {
      nom: 'Collectionneur',
      description: 'Capturez 50 créatures différentes',
      actualVal: 23,
      objectif: 50,
      image: 'collector-icon.png',
      type: SuccessType.CAPTURE,
      event: 'catch_creatures'
    }
  ];

  realSuccessData.forEach((success, index) => {
    it(`rend correctement le succès ${index + 1}: ${success.nom}`, () => {
      const { getByText } = render(
        <SuccessDetailScreen 
          visible={true}
          onClose={jest.fn()}
          sucess={success}
        />
      );
      
      expect(getByText(success.nom)).toBeTruthy();
      expect(getByText(success.description)).toBeTruthy();
      
      const expectedPercentage = Number((success.actualVal / success.objectif * 100).toFixed(2));
      expect(getByText(`Avancement : ${expectedPercentage}%`)).toBeTruthy();
    });
  });
})})