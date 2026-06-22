import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { PastVideo } from '../types';

const defaultVideos: PastVideo[] = [
  { 
    id: '1', 
    prompt: 'Cinematic wide shot of a futuristic metropolis, flying cars, rain slicked streets, neon lights reflecting on wet pavement.', 
    duration: 10, 
    creditsUsed: 10, 
    createdAt: Date.now(), 
    thumbnailUrl: '/thumbnails/metropolis.png', 
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' 
  },
  { 
    id: '2', 
    prompt: 'Close up of a neon glowing eye, cyberpunk street reflection, cybernetic enhancements.', 
    duration: 5, 
    creditsUsed: 5, 
    createdAt: Date.now() - 86400000, 
    thumbnailUrl: '/thumbnails/neon_eye.png', 
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' 
  },
  { 
    id: '3', 
    prompt: 'Drone shot flying over an alien desert landscape at sunset, massive moons in the sky, glowing crystals.', 
    duration: 15, 
    creditsUsed: 15, 
    createdAt: Date.now() - 172800000, 
    thumbnailUrl: '/thumbnails/alien_desert.png', 
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' 
  },
  { 
    id: '4', 
    prompt: 'Time lapse of a mushroom growing and glowing in a dark forest floor, magical bioluminescent atmosphere.', 
    duration: 8, 
    creditsUsed: 8, 
    createdAt: Date.now() - 259200000, 
    thumbnailUrl: '/thumbnails/glowing_mushroom.png', 
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' 
  },
];

const storedVideos = browser ? localStorage.getItem('beth_videos') : null;
export const videos = writable<PastVideo[]>(storedVideos ? JSON.parse(storedVideos) : defaultVideos);

videos.subscribe(value => {
  if (browser) {
    localStorage.setItem('beth_videos', JSON.stringify(value));
  }
});

export const galleryStore = {
  subscribe: videos.subscribe,
  addVideo: (video: PastVideo) => {
    videos.update(v => [video, ...v]);
  }
};
