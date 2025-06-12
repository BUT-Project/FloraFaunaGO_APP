import { isImageBlurry } from '@/services/imageQuality';
import * as ImageManipulator from 'expo-image-manipulator';

jest.mock('expo-image-manipulator');

const mockedManipulateAsync = ImageManipulator.manipulateAsync as jest.Mock;

describe('isImageBlurry', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('retourne true si les deux tests compression et taille valident un flou', async () => {
    mockedManipulateAsync
      .mockResolvedValueOnce({ base64: 'a'.repeat(10000) })
      .mockResolvedValueOnce({ base64: 'a'.repeat(6000) });

    const result = await isImageBlurry('fake-uri');
    expect(result).toBe(true);
  });

  it('retourne false si les deux tests indiquent que l\'image n\'est pas floue', async () => {
    mockedManipulateAsync
      .mockResolvedValueOnce({ base64: 'a'.repeat(12000) })
      .mockResolvedValueOnce({ base64: 'a'.repeat(4800) });

    const result = await isImageBlurry('fake-uri');
    expect(result).toBe(false);
  });

  it('retourne le résultat du test de compression si les tests ne sont pas d\'accord', async () => {
    mockedManipulateAsync
      .mockResolvedValueOnce({ base64: 'a'.repeat(13333) }) // light
      .mockResolvedValueOnce({ base64: 'a'.repeat(8000) }); // heavy

    const result = await isImageBlurry('fake-uri');
    expect(result).toBe(true);
  });

  it('retourne false si une erreur est levée', async () => {
    const originalConsoleError = console.error;
    console.error = jest.fn();
    mockedManipulateAsync.mockRejectedValue(new Error('Manipulation failed'));

    const result = await isImageBlurry('fake-uri');
    expect(result).toBe(false);
    console.error = originalConsoleError;
  });

  it('gère les cas où base64 est undefined', async () => {
    mockedManipulateAsync
      .mockResolvedValueOnce({}) 
      .mockResolvedValueOnce({}); // heavy sans base64

    const result = await isImageBlurry('fake-uri');
    expect(result).toBe(false);
  });
});
