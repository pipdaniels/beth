import { tweened } from 'svelte/motion';
import { cubicOut } from 'svelte/easing';
import { writable, derived } from 'svelte/store';
import type { JobStatus, GenerationLog, GenerationLength, GenerationMode, GenerationModel, GenerationFrame } from '../types';

// Track current status of the generation agent
export const jobStatus = writable<JobStatus>('idle');

// Save the active prompt parameters
export const currentPrompt = writable<string>('');
export const currentDuration = writable<number>(10);
export const currentGenerationMode = writable<GenerationMode>('video');
export const currentLength = writable<GenerationLength>('medium');
export const currentModel = writable<GenerationModel>('gpt-4.1');
export const currentFirstFrame = writable<GenerationFrame | null>(null);
export const currentLastFrame = writable<GenerationFrame | null>(null);

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
