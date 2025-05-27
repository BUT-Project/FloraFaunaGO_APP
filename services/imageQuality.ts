import * as ImageManipulator from 'expo-image-manipulator';


export async function isImageBlurry(uri: string): Promise<boolean> {
    try {
        const resizeSize = 100;

        // Compression légère et forte en parallèle
        const [light, heavy] = await Promise.all([
            ImageManipulator.manipulateAsync(uri, [{ resize: { width: resizeSize, height: resizeSize } }], {
                format: ImageManipulator.SaveFormat.JPEG,
                compress: 0.8,
                base64: true
            }),
            ImageManipulator.manipulateAsync(uri, [{ resize: { width: resizeSize, height: resizeSize } }], {
                format: ImageManipulator.SaveFormat.JPEG,
                compress: 0.3,
                base64: true
            }),
        ]);

        const lightSize = light.base64?.length || 0;
        const heavySize = heavy.base64?.length || 0;
        const compressionRatio = heavySize / lightSize;
        console.log("Ratio de compression:", compressionRatio);

        const compressionTest = compressionRatio > 0.55;

        const fileSize = (light.base64?.length || 0) * 0.75;
        console.log("Taille fichier approximative:", fileSize);

        const sizeTest = fileSize < 8000;

        console.log("Test compression:", compressionTest);
        console.log("Test taille:", sizeTest);

        // Fidèle à ta logique : on fait confiance si les 2 sont d’accord
        if (compressionTest === sizeTest) {
            return compressionTest;
        }

        // Sinon, on fait confiance au test de compression
        return compressionTest;

    } catch (error) {
        console.error("Erreur détection flou:", error);
        return false;
    }
}
