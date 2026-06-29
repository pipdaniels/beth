<script lang="ts">
  import { Input, Label, Spinner } from 'flowbite-svelte';
  import AppButton from '$lib/components/ui/AppButton.svelte';
  import { EnvelopeSolid, LockSolid, ArrowLeftOutline } from 'flowbite-svelte-icons';
  import { authState } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import { fade } from 'svelte/transition';

  let email = $state('');
  let otpCode = $state('');
  let step: 'email' | 'otp' = $state('email');
  let isSubmitting = $state(false);

  async function handleSendOTP() {
      if (!email) return;
      isSubmitting = true;
      // Mock sending the OTP
      await new Promise(r => setTimeout(r, 1000));
      isSubmitting = false;
      step = 'otp';
  }
  
  async function handleVerifyOTP() {
      if (!otpCode || otpCode.length < 6) return;
      isSubmitting = true;
      // Mock validating the OTP
      await authState.login(email);
      goto('/');
  }
</script>

<svelte:head>
  <title>OTP Sign in | GPTexist</title>
</svelte:head>

<div class="animate-fade-in relative w-full">
   <a href="/login" class="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white mb-8 transition-colors">
      <ArrowLeftOutline class="w-4 h-4 mr-2" /> Back to options
   </a>

   <div class="mb-8">
      <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white">Passcode Login</h1>
      <p class="text-gray-500 dark:text-gray-400 mt-2 text-lg">
         {#if step === 'email'}
            We'll send a secure one-time passcode to your email.
         {:else}
            Enter the 6-digit code sent to <strong class="text-primary dark:text-white font-semibold">{email}</strong>.
         {/if}
      </p>
   </div>
   
   {#if step === 'email'}
      <form transition:fade class="flex flex-col gap-6" onsubmit={(e) => { e.preventDefault(); handleSendOTP(); }}>
         <div>
            <Label class="mb-2 font-medium text-gray-900 dark:text-gray-200">Email Address</Label>
            <Input type="email" bind:value={email} placeholder="name@company.com" required size="lg" class="ps-11">
                {#snippet left()}
                   <div class="flex items-center h-full mt-[1px]">
                      <EnvelopeSolid class="w-5 h-5 text-gray-500 dark:text-gray-400" />
                   </div>
                {/snippet}
            </Input>
         </div>
         
         <AppButton type="submit" size="xl" variant="primary" class="w-full" disabled={isSubmitting}>
            {#if isSubmitting}
               <Spinner class="mr-3" size="5" color="blue" /> Sending Code...
            {:else}
               Send One-Time Passcode
            {/if}
         </AppButton>
      </form>
   {:else}
      <form transition:fade class="flex flex-col gap-6" onsubmit={(e) => { e.preventDefault(); handleVerifyOTP(); }}>
         <div>
            <Label class="mb-2 font-medium text-gray-900 dark:text-gray-200">6-Digit Code</Label>
            <Input type="text" bind:value={otpCode} placeholder="123456" required size="lg" class="tracking-[0.7em] text-center text-3xl font-mono py-4 bg-gray-50 dark:bg-gray-800 ps-11">
                {#snippet left()}
                   <div class="flex items-center h-full mt-[1px]">
                      <LockSolid class="w-6 h-6 text-gray-400" />
                   </div>
                {/snippet}
            </Input>
         </div>
         
         <AppButton type="submit" size="xl" variant="secondary" class="w-full" disabled={isSubmitting}>
            {#if isSubmitting}
               <Spinner class="mr-3" size="5" color="blue" /> Verifying...
            {:else}
               Verify & Sign In
            {/if}
         </AppButton>
         <button type="button" class="text-sm text-center font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white mt-4" onclick={() => step = 'email'}>
            Change email address?
         </button>
      </form>
   {/if}
</div>
