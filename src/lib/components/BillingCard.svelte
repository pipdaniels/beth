<script lang="ts">
   import { Card } from 'flowbite-svelte';
   import AppButton from '$lib/components/ui/AppButton.svelte';
   import type { CreditBundle } from '../types';
   
   let { bundle, onPurchase }: { bundle: CreditBundle, onPurchase: (id: string) => void } = $props();
</script>

<Card class="flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-gray-800 hover:shadow-2xl transition-all border border-gray-200 dark:border-gray-700 hover:border-secondary transform hover:-translate-y-1 overflow-hidden relative group">
   <div class="absolute top-0 left-0 w-full h-1 bg-secondary transition-transform scale-x-0 group-hover:scale-x-100 origin-left"></div>
   <h3 class="mt-2 mb-4 text-2xl font-bold text-gray-900 dark:text-white tracking-wide">{bundle.title}</h3>
   <p class="font-light text-gray-500 sm:text-md dark:text-gray-400 mb-6 h-12 leading-tight">{bundle.description}</p>
   
   <div class="flex justify-center items-center gap-2 mb-2">
      <span class="text-6xl font-extrabold text-primary dark:text-white">{bundle.amount}</span>
      <span class="text-4xl text-secondary">★</span>
   </div>
   <div class="h-6"></div>
   
   <div class="flex flex-col items-center justify-center w-full mb-8 pt-6 border-t border-gray-100 dark:border-gray-700">
      <span class="text-sm text-gray-500 dark:text-gray-400 mb-1">One-time payment</span>
      <span class="text-3xl font-bold text-gray-900 dark:text-gray-200">{bundle.currency === 'USD' ? '$' : '₦'}{bundle.price}</span>
   </div>

    <AppButton onclick={() => onPurchase(bundle.id)} variant="secondary" size="xl" class="w-full">Purchase Bundle</AppButton>
</Card>
