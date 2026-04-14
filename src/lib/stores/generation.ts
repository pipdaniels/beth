import { tweened } from 'svelte/motion';
import { cubicOut } from 'svelte/easing';
import { writable, derived } from 'svelte/store';
import type { JobStatus, GenerationLog } from '../types';

// Track current status of the generation agent
export const jobStatus = writable<JobStatus>('idle');

// Accumulate logs published via SSE stream
export const generationLogs = writable<GenerationLog[]>([]);

// Smooth progress bar update using tweened motion
export const progress = tweened(0, {
    duration: 800,
    easing: cubicOut
});

// A derived store that maps status to indices for the Timeline UI 
export const activeStepIndex = derived(jobStatus, ($status) => {
    switch ($status) {
        case 'planning': return 0;
        case 'enhancing': return 1;
        case 'generating': return 2;
        case 'stitching': return 3;
        case 'completed': return 4;
        case 'idle':
        case 'failed':
        default: return -1;
    }
});

// Helper to determine if the user is currently awaiting generation
export const isGenerating = derived(jobStatus, ($status) => {
    return !['idle', 'completed', 'failed'].includes($status);
});
