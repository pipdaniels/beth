<script lang="ts">
  import { Textarea, Label } from 'flowbite-svelte';
  import AppButton from '$lib/components/ui/AppButton.svelte';
  import { ArrowRightOutline } from 'flowbite-svelte-icons';
  import CreditEstimateWidget from '$lib/components/CreditEstimateWidget.svelte';
  import { creditBalance } from '$lib/stores/billing';
  import { goto } from '$app/navigation';
  
  import { currentPrompt, currentDuration } from '$lib/stores/generation';
  
  let promptText = $state("");
  let duration = $state(10);
  
  let isValidPrompt = $derived(promptText.trim().length > 5);
  let hasEnoughCredits = $derived($creditBalance >= duration); // rate is 1:1

  function startGeneration() {
     currentPrompt.set(promptText);
     currentDuration.set(duration);
     goto('/generate');
  }
</script>

<svelte:head>
  <title>GPTexist | Text to Video</title>
</svelte:head>

<div class="max-w-5xl mx-auto flex flex-col gap-8 py-8 animate-fade-in">
  <div class="col-span-full mb-2">
    <h1 class="text-4xl md:text-5xl font-extrabold bg-clip-text bg-primary pb-2">
      What should we create today?
    </h1>
    <p class="text-gray-500 dark:text-gray-400 text-lg mt-2">Describe the scene, style, and soundtrack for your next masterpiece.</p>
  </div>

  <div class="flex flex-col gap-8 md:gap-6">
     <!-- Prompt Section - Full Width -->
     <div class="flex flex-col gap-4">
        <Label for="prompt-area" class="text-lg font-semibold dark:text-gray-200">Cinematic Prompt</Label>
        <Textarea id="prompt-area" bind:value={promptText} rows={10} placeholder="A futuristic city cyberpunk scene, neon lights reflecting on the wet pavement, slow sweeping camera movement, ambient synths playing..." class="resize-none shadow-sm text-lg !p-4 border-gray-300 focus:ring-secondary focus:border-secondary dark:bg-gray-800 dark:border-gray-700 w-full" />
     </div>

     <!-- Settings and Generate - Centered on Desktop with Side Layout on Larger Screens -->
     <div class="flex flex-col md:flex-row gap-6 md:gap-8 md:items-end md:justify-between">
        <div class="flex-1 md:max-w-sm">
           <CreditEstimateWidget bind:duration />
        </div>
        
        <AppButton size="xl" variant="primary" class="w-full md:w-auto py-4 px-8 text-lg group" disabled={!isValidPrompt || !hasEnoughCredits} onclick={startGeneration}>
            {#if !hasEnoughCredits}
               Need More Credits
            {:else if !isValidPrompt}
               Describe Scene First
            {:else}
               Generate Masterpiece
            {/if}
            {#if isValidPrompt && hasEnoughCredits}
               <ArrowRightOutline class="ml-2 w-6 h-6 group-hover:translate-x-2 transition-transform" />
            {/if}
        </AppButton>
     </div>
  </div>
</div>
