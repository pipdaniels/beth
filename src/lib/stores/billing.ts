import { spring } from 'svelte/motion';
import { writable } from 'svelte/store';

// A writable store defining the base/target credit balance
export const creditBalance = writable<number>(50);

// A spring store that smoothly animates toward the actual balance
export const animatedBalance = spring(50, {
    stiffness: 0.1,
    damping: 0.8
});

// Automatically trigger spring animation when base balance updates
creditBalance.subscribe(value => {
    animatedBalance.set(value);
});

// Manage polling state when redirecting back from mocked payment
export const isPollingPayment = writable<boolean>(false);
