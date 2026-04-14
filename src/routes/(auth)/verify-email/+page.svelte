<script lang="ts">
  import { Spinner } from 'flowbite-svelte';
  import AppButton from '$lib/components/ui/AppButton.svelte';
  import { EnvelopeOpenSolid, CheckCircleSolid } from 'flowbite-svelte-icons';
  import { authState } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  
  let email = $page.url.searchParams.get('email') || 'your email';
  let isAuto = $page.url.searchParams.get('auto') === 'true';
  let isActivating = false;
  let hasActivated = false;

  async function handleSimulateClick() {
      // In real life, the user clicks a link in their email which opens this route with a ?token=XYZ param 
      // which we then verify via backend API Call. 
      // For this mock, clicking this button is simulating the user clicking the magic link.
      isActivating = true;
      await authState.login(email);
      hasActivated = true;
  }
  
  onMount(() => {
     if (isAuto) {
         // Google auth automatically verifies
         handleSimulateClick();
     }
  });
</script>

<svelte:head>
  <title>Verify Email | Beth</title>
</svelte:head>

<div class="animate-fade-in w-full text-center flex flex-col items-center justify-center">
   
   {#if hasActivated}
      <div transition:fade class="flex flex-col items-center">
         <CheckCircleSolid class="w-20 h-20 text-green-500 mb-6" />
         <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">Email Verified!</h1>
         <p class="text-lg text-gray-500 dark:text-gray-400 mb-10 max-w-sm">Your account setup is complete. You can now jump in and create your first masterpiece.</p>
         
         <AppButton variant="secondary" size="xl" href="/" class="w-full max-w-xs transition-transform hover:scale-105">
             Open application
         </AppButton>
      </div>
   {:else if isActivating}
      <div transition:fade class="flex flex-col items-center">
         <Spinner size="12" class="text-secondary mb-6" />
         <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">Verifying Magic Link...</h1>
         <p class="text-gray-500 dark:text-gray-400 mb-8 max-w-sm">Please hold on while we secure your session and confirm your email token.</p>
      </div>
   {:else}
      <div transition:fade class="flex flex-col items-center">
         <EnvelopeOpenSolid class="w-20 h-20 text-gray-300 dark:text-gray-700 mb-6" />
         <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">Check your email</h1>
         <p class="text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-sm">We've sent a magic link to <strong class="text-gray-900 dark:text-white">{email}</strong>. Click the link to securely confirm your registration.</p>
         
         <div class="w-full max-w-md p-6 border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-xl text-left mt-8">
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-4 uppercase font-bold tracking-widest text-center">Development Environment Mock</p>
            <AppButton variant="outline" size="lg" class="w-full" onclick={handleSimulateClick}>
                Simulate magic link click
            </AppButton>
         </div>
         <a href="/login" class="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mt-12 transition-colors">
            Return to Sign in
         </a>
      </div>
   {/if}
</div>
