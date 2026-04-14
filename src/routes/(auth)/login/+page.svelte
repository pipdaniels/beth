<script lang="ts">
  import { Input, Label, Checkbox, Spinner } from 'flowbite-svelte';
  import AppButton from '$lib/components/ui/AppButton.svelte';
  import { EnvelopeSolid, LockSolid, GoogleSolid, EyeSolid, EyeSlashSolid } from 'flowbite-svelte-icons';
  import { authState } from '$lib/stores/auth';
  import { goto } from '$app/navigation';

  let email = $state('');
  let password = $state('');
  let isSubmitting = $state(false);
  let showPassword = $state(false);

  async function handleLogin() {
      if (!email || !password) return;
      isSubmitting = true;
      await authState.login(email);
      goto('/');
  }
  
  async function handleGoogle() {
      isSubmitting = true;
      await authState.login('google_user@gmail.com');
      goto('/');
  }
</script>

<svelte:head>
  <title>Sign in | Beth</title>
</svelte:head>

<div class="animate-fade-in w-full">
   <div class="mb-8">
      <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white">Welcome back</h1>
      <p class="text-gray-500 dark:text-gray-400 mt-2">Sign in to orchestrate your AI video workflows.</p>
   </div>
   
   <form class="flex flex-col gap-5" onsubmit={(e) => { e.preventDefault(); handleLogin(); }}>
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
      <div>
         <Label class="mb-2 font-medium text-gray-900 dark:text-gray-200">Password</Label>
         <div class="relative w-full">
            <Input type={showPassword ? 'text' : 'password'} bind:value={password} placeholder="••••••••" required size="lg" class="ps-11 pr-12">
                {#snippet left()}
                   <div class="flex items-center h-full mt-[6px]">
                      <LockSolid class="w-5 h-5 text-gray-500 dark:text-gray-400" />
                   </div>
                {/snippet}
            </Input>
            <button type="button" onclick={() => showPassword = !showPassword} class="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2">
                 {#if showPassword}
                     <EyeSlashSolid class="w-6 h-6 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors" />
                 {:else}
                     <EyeSolid class="w-6 h-6 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors" />
                 {/if}
            </button>
         </div>
      </div>
      
      <div class="flex items-center justify-between mb-2">
         <Checkbox class="text-gray-500 dark:text-gray-400 cursor-pointer "><span class="pl-3">Remember me</span></Checkbox>
         <a href="/forgot-password" class="text-sm font-medium text-secondary hover:underline">Forgot password?</a>
      </div>
      
      <AppButton type="submit" size="xl" variant="primary" class="w-full" disabled={isSubmitting}>
         {#if isSubmitting}
            <Spinner class="mr-3" size="5" color="blue" /> Processing...
         {:else}
            Sign In
         {/if}
      </AppButton>
   </form>
   
   <div class="my-8 flex items-center justify-center space-x-4">
      <hr class="w-1/3 border-gray-200 dark:border-gray-700">
      <span class="text-sm font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest">or</span>
      <hr class="w-1/3 border-gray-200 dark:border-gray-700">
   </div>
   
   <div class="flex flex-col gap-4">
      <AppButton variant="outline" size="lg" class="w-full" disabled={isSubmitting} onclick={handleGoogle}>
         <GoogleSolid class="w-5 h-5 mr-3 text-gray-900 dark:text-white" />
         Sign in with Google
      </AppButton>
      
      <AppButton href="/login/otp" variant="outline" size="lg" class="w-full" disabled={isSubmitting}>
         Sign in with One-Time Passcode
      </AppButton>
   </div>
   
   <p class="text-sm font-medium text-gray-600 dark:text-gray-400 text-center mt-10">
      Don’t have an account yet? <a href="/signup" class="font-bold text-secondary hover:underline ml-1">Sign up for free</a>
   </p>
</div>
