import {useCallback, useEffect, useState} from "react";
import {CameraType, useCameraPermissions} from "expo-camera";

export function useCamera() {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();

    useEffect(() => {
        requestPermission();
    }, [requestPermission]);

    async function requestPerm(){
        await requestPermission()
    }

    const toggleCameraFacing = useCallback(() => {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }, []);

    return {facing, toggleCameraFacing, permission,requestPerm};
}
// const requestLocationPermission = async () => {
//     const { status } = await Location.requestForegroundPermissionsAsync();
//     if (status !== 'granted') {
//         alert(
//             "Oups ! Il semble que l'accès à votre localisation soit désactivé. Pour découvrir la musique des personnes autour de vous, veuillez autoriser l'accès à la localisation dans les paramètres de votre appareil."
//         );
//     } else {
//         setLocationPermission(true);
//     }
// }
// useEffect(() => {
//     requestLocationPermission();
// }, []);