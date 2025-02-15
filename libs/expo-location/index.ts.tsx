import * as ExpoLocation from 'expo-location';
import Location from '@/model/domain/Location';

export default async function getCurrentLocation(): Promise<Location> {
    try {
        const location = await ExpoLocation.getCurrentPositionAsync({
            accuracy: ExpoLocation.Accuracy.Balanced,
        });

        return new Location(
            location.coords.latitude,
            location.coords.longitude,
            location.coords.altitude ?? 0,
            20,
            location.coords.accuracy ?? 0
        );
    } catch (error) {
        console.error('Error getting location:', error);
        throw new Error('Failed to get your current location');
    }
}