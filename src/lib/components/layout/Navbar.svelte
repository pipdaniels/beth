<script lang="ts">
  import { Navbar, NavBrand, Badge } from 'flowbite-svelte';
  import AppButton from '$lib/components/ui/AppButton.svelte';
  import { animatedBalance } from '$lib/stores/billing';
  import { authState, userSession } from '$lib/stores/auth';
  import { SunOutline, MoonOutline } from 'flowbite-svelte-icons';
  import { onMount } from 'svelte';

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

<Navbar fluid class="border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 bg-white dark:bg-gray-900">
  <NavBrand href="/">
    <span class="self-center whitespace-nowrap text-2xl font-bold dark:text-white text-primary">Beth</span>
  </NavBrand>

  <div class="flex items-center gap-4">
    <a href="/billing" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
      <Badge color="blue" class="text-sm px-3 py-1 font-medium bg-secondary text-white border-secondary dark:bg-secondary dark:text-white tracking-widest min-w-[80px] text-center">
        {Math.round($animatedBalance)} ★
      </Badge>
    </a>
    <button onclick={toggleTheme} class="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 transition-colors">
      {#if isDark}
        <SunOutline class="w-5 h-5" />
      {:else}
        <MoonOutline class="w-5 h-5" />
      {/if}
    </button>
    {#if $userSession}
       <AppButton variant="outline" size="xs" class="ml-2 !w-auto" onclick={() => authState.logout()}>Logout</AppButton>
    {/if}
  </div>
</Navbar>
