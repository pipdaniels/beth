export interface User {
    id: string;
    name: string;
    email: string;
    creditBalance: number;
}

export type JobStatus = 'idle' | 'planning' | 'enhancing' | 'generating' | 'stitching' | 'completed' | 'failed';

export interface GenerationLog {
    id: string;
    timestamp: number;
    step: JobStatus;
    message: string;
}

export interface CreditBundle {
    id: string;
    amount: number;
    price: number;
    currency: 'USD' | 'NGN';
    title: string;
    description: string;
}

export interface Job {
    id: string;
    prompt: string;
    duration: number; // in seconds
    costEstimate: number;
    status: JobStatus;
    logs: GenerationLog[];
    videoUrl?: string; // signed R2 download link
}

export interface PastVideo {
    id: string;
    thumbnailUrl: string;
    videoUrl: string;
    prompt: string;
    creditsUsed: number;
    createdAt: number; // timestamp
    duration: number;
}
