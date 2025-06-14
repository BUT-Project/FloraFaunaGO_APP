import {useReducer} from "react";

export type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];
export function useAsyncState<T>(
    initialValue: [boolean, T | null] = [true, null],
): UseStateHook<T> {
    return useReducer(
        (state: [boolean, T | null], action: T | null = null): [boolean, T | null] => [false, action],
        initialValue
    ) as UseStateHook<T>;
}
export function getImageUri(image?: string | null): string | undefined {

    if (!image || typeof image !== 'string') {
        return undefined;
    }

    const trimmed = image.trim();

    if (trimmed.startsWith('data:image')) {
        return trimmed;
    } else if (trimmed.startsWith('/9j/') || trimmed.length > 100) {
        return `data:image/jpeg;base64,${trimmed}`; // assume it's raw base64
    } else {
        return trimmed; // regular URL
    }
}

export function tryParseEnum<T extends Record<string, string | number>>(
    enumObj: T,
    value: string | number
): T[keyof T] | undefined {
    const values = Object.values(enumObj);
    if (values.includes(value as T[keyof T])) {
        return value as T[keyof T];
    }
    return undefined;
}