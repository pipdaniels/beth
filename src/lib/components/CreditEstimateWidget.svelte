<script lang="ts">
  import { Label, Range } from 'flowbite-svelte';
  import { creditBalance } from '$lib/stores/billing';
  
  // Expose duration to parent
  let { duration = $bindable(10) } = $props();
  
  // Rate: 1 credit per second
  let costEstimate = $derived(duration * 1);
  let hasEnoughCredits = $derived($creditBalance >= costEstimate);
</script>

<div class="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow flex flex-col gap-4">
  <div class="flex justify-between items-center">
    <Label class="text-gray-800 dark:text-gray-200 font-semibold">Video Duration</Label>
    <span class="text-lg font-bold text-secondary">{duration}s</span>
  </div>
  <Range min="5" max="60" bind:value={duration} class="cursor-pointer" />
  
  <div class="flex items-center justify-between mt-4 border-t border-gray-100 dark:border-gray-700 pt-4">
     <span class="text-sm text-gray-500 dark:text-gray-400">
        Cost: <strong class="text-primary dark:text-white text-lg">{costEstimate} ★</strong>
     </span>
     <span class="text-sm text-gray-500 dark:text-gray-400">
        Balance: <strong class="{$creditBalance < costEstimate ? 'text-red-500' : 'text-gray-900 dark:text-gray-100'}">{$creditBalance} ★</strong>
     </span>
  </div>
  {#if !hasEnoughCredits}
     <p class="text-xs text-red-500 mb-2">Not enough credits for this generation length.</p>
  {/if}
</div>
