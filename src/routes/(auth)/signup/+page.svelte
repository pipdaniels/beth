<script lang="ts">
  import { Input, Label, Spinner } from 'flowbite-svelte';
  import AppButton from '$lib/components/ui/AppButton.svelte';
  import { EnvelopeSolid, LockSolid, GoogleSolid, UserCircleSolid, EyeSolid, EyeSlashSolid } from 'flowbite-svelte-icons';
  import { goto } from '$app/navigation';

  let name = $state('');
  let email = $state('');
  let password = $state('');
  let isSubmitting = $state(false);
  let showPassword = $state(false);

  async function handleSignup() {
      if (!email || !password || !name) return;
      isSubmitting = true;
      await new Promise(r => setTimeout(r, 1500));
      goto(`/verify-email?email=${encodeURIComponent(email)}`);
  }
  
  async function handleGoogle() {
      isSubmitting = true;
      await new Promise(r => setTimeout(r, 1500));
      goto(`/verify-email?email=google_user@gmail.com&auto=true`);
  }
</script>

<svelte:head>
  <title>Sign up | Beth</title>
</svelte:head>

<div class="animate-fade-in w-full">
   <div class="mb-8">
      <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white">Create an account</h1>
      <p class="text-gray-500 dark:text-gray-400 mt-2">Start generating breathtaking cinematic AI videos today.</p>
   </div>
   
   <form class="flex flex-col gap-5" onsubmit={(e) => { e.preventDefault(); handleSignup(); }}>
      <div>
         <Label class="mb-2 font-medium text-gray-900 dark:text-gray-200">Full Name</Label>
         <Input type="text" bind:value={name} placeholder="Jane Doe" required size="lg" class="ps-11">
             {#snippet left()}
                <div class="flex items-center h-full mt-[6px]">
                   <UserCircleSolid class="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </div>
             {/snippet}
         </Input>
      </div>
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
                   <div class="flex items-center h-full mt-[4px]">
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
         <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">Must be at least 8 characters.</p>
      </div>
      
      <AppButton type="submit" size="xl" variant="primary" class="w-full" disabled={isSubmitting}>
         {#if isSubmitting}
            <Spinner class="mr-3" size="5" color="blue" /> Creating account...
         {:else}
            Sign Up
         {/if}
      </AppButton>
   </form>
   
   <div class="my-8 flex items-center justify-center space-x-4">
      <hr class="w-1/3 border-gray-200 dark:border-gray-700">
      <span class="text-sm font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest">or</span>
      <hr class="w-1/3 border-gray-200 dark:border-gray-700">
   </div>
   
   <AppButton variant="outline" size="lg" class="w-full" disabled={isSubmitting} onclick={handleGoogle}>
      <GoogleSolid class="w-5 h-5 mr-3 text-gray-900 dark:text-white" />
      Sign up with Google
   </AppButton>
   
   <p class="text-sm font-medium text-gray-600 dark:text-gray-400 text-center mt-10">
      Already have an account? <a href="/login" class="font-bold text-secondary hover:underline ml-1">Sign in</a>
   </p>
</div>
