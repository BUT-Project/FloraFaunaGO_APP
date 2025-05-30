import {useCallback, useState} from "react";
import {CameraType, useCameraPermissions} from "expo-camera";

export function useCamera() {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission,requestPerm] = useCameraPermissions();

    const toggleCameraFacing = useCallback(() => setFacing(current => (current === 'back' ? 'front' : 'back')),[]);

    return {facing, toggleCameraFacing, permission,requestPerm};
};