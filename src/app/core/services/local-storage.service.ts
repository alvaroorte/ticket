import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {

    get(key: string): string | null {
        return localStorage.getItem(key)?? null;
    }

    set(key: string, value: string): void {
        localStorage.setItem(key, value);
    }

    remove(key: string): void {
        localStorage.removeItem(key);
    }

    removeAll(): void {
        localStorage.clear();
    }
}
