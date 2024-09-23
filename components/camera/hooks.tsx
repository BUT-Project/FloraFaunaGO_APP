import { useCallback, useEffect, useState} from "react";
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