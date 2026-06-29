import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export interface SocialAccount {
  id: string;
  platform: 'tiktok' | 'instagram';
  handle: string;
  avatarUrl: string;
  connectedAt: number;
}

export interface SocialPost {
  id: string;
  videoId: string;
  videoPrompt: string;
  thumbnailUrl: string;
  platform: 'tiktok' | 'instagram';
  accountHandle: string;
  caption: string;
  status: 'scheduled' | 'published';
  scheduledTime?: string;
  createdAt: number;
}

const defaultAccounts: SocialAccount[] = [
  { 
    id: 'acc-1', 
    platform: 'tiktok', 
    handle: '@gptexist_creator', 
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop', 
    connectedAt: Date.now() 
  },
  { 
    id: 'acc-2', 
    platform: 'instagram', 
    handle: '@gptexist_visuals', 
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop', 
    connectedAt: Date.now() 
  }
];

const defaultPosts: SocialPost[] = [
  {
    id: 'post-1',
    videoId: '1',
    videoPrompt: 'Cinematic wide shot of a futuristic metropolis, flying cars...',
    thumbnailUrl: '/thumbnails/metropolis.png',
    platform: 'tiktok',
    accountHandle: '@gptexist_creator',
    caption: 'Behold the future metropolis! Generated entirely with GPTexist AI. 🚀✨ #AI #scifi',
    status: 'published',
    createdAt: Date.now() - 3600000
  }
];

const storedAccounts = browser ? localStorage.getItem('social_accounts') : null;
const storedPosts = browser ? localStorage.getItem('social_posts') : null;

export const socialAccounts = writable<SocialAccount[]>(storedAccounts ? JSON.parse(storedAccounts) : defaultAccounts);
export const socialPosts = writable<SocialPost[]>(storedPosts ? JSON.parse(storedPosts) : defaultPosts);

socialAccounts.subscribe(value => {
  if (browser) {
    localStorage.setItem('social_accounts', JSON.stringify(value));
  }
});

socialPosts.subscribe(value => {
  if (browser) {
    localStorage.setItem('social_posts', JSON.stringify(value));
  }
});

export const socialStore = {
  subscribeAccounts: socialAccounts.subscribe,
  subscribePosts: socialPosts.subscribe,
  
  connectAccount: (platform: 'tiktok' | 'instagram', handle: string) => {
    const cleanHandle = handle.startsWith('@') ? handle : '@' + handle;
    const newAccount: SocialAccount = {
      id: 'acc-' + Date.now(),
      platform,
      handle: cleanHandle,
      avatarUrl: platform === 'tiktok' 
        ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop'
        : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
      connectedAt: Date.now()
    };
    socialAccounts.update(accs => [...accs, newAccount]);
  },
  
  disconnectAccount: (id: string) => {
    socialAccounts.update(accs => accs.filter(acc => acc.id !== id));
  },
  
  publishPost: (
    videoId: string, 
    videoPrompt: string, 
    thumbnailUrl: string, 
    platform: 'tiktok' | 'instagram', 
    accountHandle: string, 
    caption: string, 
    scheduledTime?: string
  ) => {
    const newPost: SocialPost = {
      id: 'post-' + Date.now(),
      videoId,
      videoPrompt,
      thumbnailUrl,
      platform,
      accountHandle,
      caption,
      status: scheduledTime ? 'scheduled' : 'published',
      scheduledTime,
      createdAt: Date.now()
    };
    socialPosts.update(posts => [newPost, ...posts]);
  }
};
