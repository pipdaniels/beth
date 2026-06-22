import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const storedCollapsed = browser ? localStorage.getItem('sidebar_collapsed') === 'true' : false;
export const sidebarCollapsed = writable<boolean>(storedCollapsed);

sidebarCollapsed.subscribe(value => {
  if (browser) {
    localStorage.setItem('sidebar_collapsed', String(value));
  }
});
