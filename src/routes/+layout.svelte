<script lang="ts">
  import '../css/app.css';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { userSession } from '$lib/stores/auth';

  let { children } = $props();

  $effect(() => {
     // Protect all routes by checking if not on auth and user is missing
     const isAuthRoute = $page.route.id?.includes('/(auth)');
     if (!$userSession && !isAuthRoute) {
         goto('/login');
     }
  });
</script>

<svelte:head>
  <link rel="icon" href="/gptexist-logo.png" />
  <title>GPTexist</title>
</svelte:head>

<div class="h-screen w-full bg-white dark:bg-gray-900 overflow-hidden font-sans text-gray-900 dark:text-gray-100">
   {@render children()}
</div>
