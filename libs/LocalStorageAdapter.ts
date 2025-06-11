import {IKVStorage} from "@/services/IKVStorage";
import {getStorageItemAsync, setStorageItemAsync} from "@/libs/secureStore";

export class SecureLocalStorageAdapter implements IKVStorage {
    async setItem(key: string, value: string): Promise<void> {
        return await setStorageItemAsync(key, value);
    }

    async getItem(key: string): Promise<string | null> {
        return await getStorageItemAsync(key);
    }

    async removeItem(key: string): Promise<void> {
        return await setStorageItemAsync(key, null);
    }
}