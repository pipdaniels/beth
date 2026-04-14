<script lang="ts">
  import { Input, Label, Spinner } from 'flowbite-svelte';
  import AppButton from '$lib/components/ui/AppButton.svelte';
  import { LockSolid, EyeSolid, EyeSlashSolid, CheckCircleSolid } from 'flowbite-svelte-icons';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { fade } from 'svelte/transition';

  let email = $page.url.searchParams.get('email') || 'your email';
  let password = $state('');
  let confirmPassword = $state('');
  let isSubmitting = $state(false);
  let isSuccess = $state(false);
  let showPassword = $state(false);
  let showConfirmPassword = $state(false);

  let passwordsMatch = $derived(password !== '' && password === confirmPassword);

  async function handlePasswordReset() {
      if (!passwordsMatch || password.length < 8) return;
      isSubmitting = true;
      await new Promise(r => setTimeout(r, 1500));
      isSubmitting = false;
      isSuccess = true;
  }
</script>

<svelte:head>
  <title>Set New Password | Beth</title>
</svelte:head>

<div class="animate-fade-in w-full text-center flex flex-col items-center justify-center">
   
   {#if isSuccess}
      <div transition:fade class="flex flex-col items-center w-full">
         <CheckCircleSolid class="w-20 h-20 text-green-500 mb-6" />
         <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">Password Updated!</h1>
         <p class="text-lg text-gray-500 dark:text-gray-400 mb-10 max-w-sm">Your password has been securely reset. You can now login with your new credentials.</p>
         
         <AppButton variant="primary" size="xl" href="/login" class="w-full max-w-xs">
             Return to Sign In
         </AppButton>
      </div>
   {:else}
      <div transition:fade class="w-full text-left">
         <div class="mb-8">
            <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white">Set new password</h1>
            <p class="text-gray-500 dark:text-gray-400 mt-2">Please create a new password for <strong class="text-primary dark:text-white font-medium">{email}</strong>.</p>
         </div>
         
         <form class="flex flex-col gap-5" onsubmit={(e) => { e.preventDefault(); handlePasswordReset(); }}>
            <div>
               <Label class="mb-2 font-medium text-gray-900 dark:text-gray-200">New Password</Label>
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
            <div>
               <Label class="mb-2 font-medium text-gray-900 dark:text-gray-200">Confirm Password</Label>
               <div class="relative w-full">
                   <Input type={showConfirmPassword ? 'text' : 'password'} bind:value={confirmPassword} placeholder="••••••••" required size="lg" class="ps-11 pr-12">
                       {#snippet left()}
                          <div class="flex items-center h-full mt-[1px]">
                             <LockSolid class="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          </div>
                       {/snippet}
                   </Input>
                   <button type="button" onclick={() => showConfirmPassword = !showConfirmPassword} class="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2">
                       {#if showConfirmPassword}
                           <EyeSlashSolid class="w-6 h-6 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors" />
                       {:else}
                           <EyeSolid class="w-6 h-6 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors" />
                       {/if}
                   </button>
               </div>
               {#if password && confirmPassword && !passwordsMatch}
                  <p class="mt-2 text-sm text-red-600 dark:text-red-500 font-medium">Passwords do not match.</p>
               {:else}
                  <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">Must be at least 8 characters.</p>
               {/if}
            </div>
            
            <AppButton type="submit" size="xl" variant="secondary" class="w-full" disabled={isSubmitting || !passwordsMatch || password.length < 8}>
               {#if isSubmitting}
                  <Spinner class="mr-3" size="5" color="blue" /> Updating...
               {:else}
                  Reset Password
               {/if}
            </AppButton>
         </form>
      </div>
   {/if}
</div>
