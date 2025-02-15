import {Platform} from "react-native";
import * as SecureStore from 'expo-secure-store';
import {useAsyncState, UseStateHook} from "@/shared/utils";
import {useCallback, useEffect} from "react";

export async function setStorageItemAsync(key: string, value: string | null) {
    if (Platform.OS === 'web') {
        try {
            if (value === null) {
                localStorage.removeItem(key);
            } else {
                localStorage.setItem(key, value);
            }
        } catch (e) {
            console.error('Local storage is unavailable:', e);
        }
    } else {
        if (value == null) {
            await SecureStore.deleteItemAsync(key);
        } else {
            await SecureStore.setItemAsync(key, value);
        }
    }
}

export function useStorageState(key: string): UseStateHook<string> {
    const [state, setState] = useAsyncState<string>();
console.log("Storage state", state);
    useEffect(() => {
        console.log('SecureStore useStorageState', state);
        if (Platform.OS === 'web') {
            try {
                if (typeof localStorage !== 'undefined') {
                    setState(localStorage.getItem(key));
                }
            } catch (e) {
                console.error('Local storage is unavailable:', e);
            }
        } else {
            console.log('Local storage is unavailable:', state);
            SecureStore.getItemAsync(key).then(value => {
                console.log(key, value);
                setState(value);
            });
        }
    }, [key]);

    // Set
    const setValue = useCallback(
        (value: string | null) => {
            setState(value);
            setStorageItemAsync(key, value);
        },
        [key]
    );

    return [state, setValue];
}
