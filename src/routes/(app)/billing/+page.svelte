<script lang="ts">
  import BillingCard from '$lib/components/BillingCard.svelte';
  import type { CreditBundle } from '$lib/types';
  import { isPollingPayment, creditBalance } from '$lib/stores/billing';
  import { Spinner, Toast } from 'flowbite-svelte';
  import { CheckCircleSolid } from 'flowbite-svelte-icons';
  import { fade } from 'svelte/transition';

  const bundles: CreditBundle[] = [
     { id: 'starter', amount: 50, price: 9.99, currency: 'USD', title: 'Starter Pack', description: 'Perfect for quick tests.' },
     { id: 'pro', amount: 200, price: 29.99, currency: 'USD', title: 'Pro Creator', description: 'Most popular option.' },
     { id: 'studio', amount: 1000, price: 99.99, currency: 'USD', title: 'Studio License', description: 'For heavy power users.' }
  ];

  let showToast = false;
  let topupAmount = 0;

  function handlePurchase(id: string) {
      const bundle = bundles.find(b => b.id === id);
      if(!bundle) return;
      
      // Mock redirect and verify flow
      $isPollingPayment = true;
      
      setTimeout(() => {
          // Success callback
          $isPollingPayment = false;
          topupAmount = bundle.amount;
          $creditBalance += bundle.amount; // Will trigger spring animation
          showToast = true;
          setTimeout(() => showToast = false, 4000);
      }, 3000);
  }
</script>

<svelte:head>
  <title>Billing | GPTexist</title>
</svelte:head>

<div class="max-w-6xl mx-auto py-12 relative animate-fade-in">
   <div class="mb-14 text-center">
     <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white pb-4 tracking-tight">Top Up Credits</h1>
     <p class="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-lg leading-relaxed">Fuel your creativity. Purchase credits securely seamlessly to drive the Veo 3.0 Generation models.</p>
   </div>

   {#if $isPollingPayment}
      <div transition:fade class="absolute inset-0 z-10 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md flex flex-col items-center justify-center rounded-xl min-h-[400px]">
          <Spinner size="12" class="text-secondary" />
          <p class="mt-6 text-xl font-medium text-gray-900 dark:text-white animate-pulse">Awaiting payment verification...</p>
      </div>
   {/if}

   <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      {#each bundles as bundle (bundle.id)}
         <BillingCard {bundle} onPurchase={handlePurchase} />
      {/each}
   </div>

   {#if showToast}
      <div transition:fade class="fixed bottom-24 md:bottom-12 left-1/2 -translate-x-1/2 z-50">
         <Toast color="green" class="shadow-2xl font-bold px-6 py-4 rounded-xl border border-green-200 dark:border-green-800">
            <svelte:fragment slot="icon">
               <CheckCircleSolid class="w-6 h-6 text-green-500" />
            </svelte:fragment>
            Successfully added {topupAmount} ★ to your balance!
         </Toast>
      </div>
   {/if}
</div>
