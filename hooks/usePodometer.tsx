import { useState, useEffect } from 'react';
import { Pedometer } from 'expo-sensors';
import { useAuthStore } from '@/context/zustand/store/useAuthStore';

type usePodometerProps = {
    isAuthenticated:Boolean
};

export function usePodometer({isAuthenticated=false}:usePodometerProps){
    const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
    const updateStepCount = useAuthStore((state) => state.updateStepCount);

    useEffect(() => {
        if (!isAuthenticated) return;

        let subscription: { remove: () => void } | null = null;

        const start = async () => {
            const result = await Pedometer.requestPermissionsAsync();
            console.log('Permission result:', result);

            if (result.granted) {
            const isAvailable = await Pedometer.isAvailableAsync();
            setIsPedometerAvailable(String(isAvailable));

            subscription = Pedometer.watchStepCount(result => {
                console.log("result :", result);
                updateStepCount(result.steps);
            });
            } else {
            console.warn("Permission denied. Invite user to enable it manually.");
            }
        };

        start();

        return () => {
            if (subscription) {
            subscription.remove();
            }
        };
    }, [isAuthenticated]);

    return {
        isPedometerAvailable,
    };
}