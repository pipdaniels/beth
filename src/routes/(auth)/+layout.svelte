<script lang="ts">
  import { SunOutline, MoonOutline } from 'flowbite-svelte-icons';
  import { onMount } from 'svelte';

  let { children } = $props();
  let isDark = $state(false);

  onMount(() => {
    isDark = document.documentElement.classList.contains('dark') || 
             (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  function toggleTheme() {
    isDark = !isDark;
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('color-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('color-theme', 'light');
    }
  }
</script>

<div class="flex min-h-screen w-full font-sans bg-white dark:bg-gray-900 animate-fade-in">
    <!-- Left Pane: Split Auth Format (Forms) -->
    <div class="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-6 lg:px-20 relative">
       <div class="absolute top-4 right-4">
          <button onclick={toggleTheme} class="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 transition-colors">
            {#if isDark}
              <SunOutline class="w-5 h-5" />
            {:else}
              <MoonOutline class="w-5 h-5" />
            {/if}
          </button>
       </div>
       <div class="w-full max-w-md mx-auto">
          <div class="mb-8 flex items-center gap-3">
             <img src="/gptexist-logo.png" alt="GPTexist" class="h-12 w-auto max-w-[220px] object-contain" />
          </div>
          {@render children()}
       </div>
    </div>
    
    <!-- Right Pane: Cinematic Poster / Video Loop Mockup -->
    <div class="hidden lg:block lg:w-1/2 relative overflow-hidden bg-gray-900 border-l border-gray-200 dark:border-gray-800">
       <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent z-10 w-full h-full"></div>
       <img src="https://images.unsplash.com/photo-1620503374956-c942862f0372?q=80&w=2000&auto=format&fit=crop" alt="Cinematic AI Render Placeholder" class="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-overlay" />
       <div class="absolute inset-0 bg-blue-500 opacity-20 mix-blend-multiply"></div>
       
       <div class="absolute bottom-20 left-16 z-20 max-w-xl text-white pr-8">
          <h2 class="text-5xl font-extrabold mb-6 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Prompt your imagination into reality.</h2>
          <p class="text-xl text-gray-300">Join the next generation of cinematic AI video synthesis powered by Google ADK and Veo 3.0.</p>
       </div>
    </div>
</div>
