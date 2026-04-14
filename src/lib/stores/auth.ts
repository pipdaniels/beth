import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { User } from '../types';

const storedUser = browser ? localStorage.getItem('beth_user') : null;
export const userSession = writable<User | null>(storedUser ? JSON.parse(storedUser) : null);

export const authState = {
    subscribe: userSession.subscribe,
    login: async (email: string) => {
        await new Promise(r => setTimeout(r, 1500));
        const mockUser: User = {
            id: 'mock-' + Date.now(),
            name: email.split('@')[0],
            email,
            creditBalance: 50
        };
        userSession.set(mockUser);
        if (browser) localStorage.setItem('beth_user', JSON.stringify(mockUser));
    },
    logout: () => {
        userSession.set(null);
        if (browser) localStorage.removeItem('beth_user');
    }
};
