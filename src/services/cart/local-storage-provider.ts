import { getRandomInteger } from "../../utils/common/random";
import LocalProvider from "./local-provider";
import storeConfig from '../../config/store-config.json';

export default class LocalStorageProvider<T> implements LocalProvider<T> {

    constructor(private localStorageName: string) {}
    
    add(item: T): T {
        item = {...item, id: this.getRandomId()};
        const storage = this.getAll();
        storage.push(item);
        localStorage.setItem(this.localStorageName, JSON.stringify(storage));
        return item;
    }

    get(id: string): T | null {
        if (!this.exists(id)){
            return null;
        }
        const storage = this.getAll();
        return storage.find((item: any) => item.id === id) as T;
    }

    getAll(): T[] {
        const storageStr = localStorage.getItem(this.localStorageName);
        if (!storageStr) {
            return [];
        } else {
            return JSON.parse(storageStr);
        }
    }

    exists(id: string): boolean {
        const storage = this.getAll();
        return storage.find((item: any) => item.id === id) !== undefined;
    }

    update(id: string, newItem: T): T | null {
        if (!this.exists(id)) {
            return null;
        }
        const oldItem = this.get(id);
        this.remove(id);
        newItem = {...newItem, id};
        const storage = this.getAll();
        storage.push(newItem);
        localStorage.setItem(this.localStorageName, JSON.stringify(storage));
        return oldItem;
    }

    remove(id: string): T | null {
        const storage = this.getAll();
        const index = storage.findIndex((item: any) => item.id === id);
        if (index >= 0) {
            const oldItem = this.get(id);
            storage.splice(index, 1);
            return oldItem;
        } else {
            return null;
        }
    }

    removeAll(): void {
        localStorage.removeItem(this.localStorageName);
    }
    
    private getRandomId(): string {
        let res: number;
        do {
            res = getRandomInteger(storeConfig.minId, storeConfig.maxId);
        } while (this.exists(res.toString()))
        return '' + res;
    }
}