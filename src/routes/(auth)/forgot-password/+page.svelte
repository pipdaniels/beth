<script lang="ts">
  import { Input, Label, Spinner } from 'flowbite-svelte';
  import AppButton from '$lib/components/ui/AppButton.svelte';
  import { EnvelopeSolid, ArrowLeftOutline } from 'flowbite-svelte-icons';
  import { goto } from '$app/navigation';
  import { fade } from 'svelte/transition';

  let email = $state('');
  let isSubmitting = $state(false);
  let isSent = $state(false);

  async function handleResetRequest() {
      if (!email) return;
      isSubmitting = true;
      await new Promise(r => setTimeout(r, 1000));
      isSubmitting = false;
      isSent = true;
  }
</script>

<svelte:head>
  <title>Reset Password | GPTexist</title>
</svelte:head>

<div class="animate-fade-in w-full">
   <a href="/login" class="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-6 transition-colors">
      <ArrowLeftOutline class="w-4 h-4 mr-2" /> Back to sign in
   </a>

   <div class="mb-8">
      <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white">Reset Password</h1>
      <p class="text-gray-500 dark:text-gray-400 mt-2">
         {#if !isSent}
            Enter your email and we'll send you instructions to reset your password.
         {:else}
            Check your inbox! We've sent a recovery link to <strong class="text-gray-900 dark:text-white">{email}</strong>.
         {/if}
      </p>
   </div>
   
   {#if !isSent}
      <form transition:fade class="flex flex-col gap-5" onsubmit={(e) => { e.preventDefault(); handleResetRequest(); }}>
         <div>
            <Label class="mb-2 font-medium text-gray-900 dark:text-gray-200">Email Address</Label>
            <Input type="email" bind:value={email} placeholder="name@company.com" required size="lg" class="ps-11">
                {#snippet left()}
                   <div class="flex items-center h-full mt-[6px]">
                      <EnvelopeSolid class="w-5 h-5 text-gray-500 dark:text-gray-400" />
                   </div>
                {/snippet}
            </Input>
         </div>
         
         <AppButton type="submit" size="xl" variant="primary" class="w-full" disabled={isSubmitting}>
            {#if isSubmitting}
               <Spinner class="mr-3" size="5" color="blue" /> Sending...
            {:else}
               Send Recovery Link
            {/if}
         </AppButton>
      </form>
   {:else}
      <div transition:fade class="w-full p-6 border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-xl text-left mt-4">
         <p class="text-xs text-gray-500 dark:text-gray-400 mb-4 uppercase font-bold tracking-widest text-center">Development Mock</p>
         <AppButton variant="outline" size="lg" class="w-full" href={`/reset-password?email=${encodeURIComponent(email)}`}>
             Simulate clicking recovery link in email
         </AppButton>
      </div>
   {/if}
</div>
