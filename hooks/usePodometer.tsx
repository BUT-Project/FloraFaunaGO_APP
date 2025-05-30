import { useState, useEffect } from 'react';
import { Pedometer } from 'expo-sensors';
import { useAuthStore } from '@/context/zustand/store/useAuthStore';

type usePodometerProps = {
    isAuthenticated:Boolean
};

export function usePodometer({isAuthenticated=false}:usePodometerProps){
    const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
    const updateStepCount = useAuthStore((state) => state.updateStepCount);

    const subscribe = async () => {
        
        const isAvailable = await Pedometer.isAvailableAsync();
        setIsPedometerAvailable(String(isAvailable));

        //Possibilité d'afficher le nombre de pas dans les dernières 24h (x Heures)
        // if (isAvailable) {
        // const end = new Date();
        // const start = new Date();
        // start.set
        // Date(end.getDate() - 1);

        // const pastStepCountResult = await Pedometer.getStepCountAsync(start, end);
        // if (pastStepCountResult) {
        //     setPastStepCount(pastStepCountResult.steps);
        // }

        return Pedometer.watchStepCount(result => {
            console.log("result :",result)
            updateStepCount(result.steps);
        });
    }

    useEffect(() => {
        if(!isAuthenticated) return;

        const askPermissions = async() => {
            const result =    await Pedometer.requestPermissionsAsync();
            console.log(result)
            return result
        }
        askPermissions();

        const permissions = async() =>{
            const permissions =  await Pedometer.getPermissionsAsync();
            console.log(permissions)
            return permissions;
        } 
        
        permissions()
        let subscription: { remove: () => void } | null = null;

        const start = async () => {
            subscription = await subscribe();
        };

        start();
        console.log(subscription)
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