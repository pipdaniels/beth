<script lang="ts">
  import { Label, Toggle, Button } from 'flowbite-svelte';

  let darkMode = $state(false);
  let notifications = $state(true);
  let emailUpdates = $state(true);

  function handleSaveSettings() {
    // Handle settings save logic here
    alert('Settings saved successfully!');
  }
</script>

<svelte:head>
  <title>Beth | Settings</title>
</svelte:head>

<div class="max-w-3xl mx-auto py-8 animate-fade-in">
  <h1 class="text-4xl md:text-5xl font-extrabold bg-clip-text bg-primary pb-4 mb-8">Settings</h1>

  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8 space-y-8">
    <!-- Display Settings -->
    <div class="border-b border-gray-200 dark:border-gray-700 pb-8">
      <h2 class="text-2xl font-bold mb-6 dark:text-white">Display Settings</h2>
      
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <Label class="text-lg font-semibold dark:text-gray-200">Dark Mode</Label>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Enable dark theme for the interface</p>
          </div>
          <Toggle bind:checked={darkMode} />
        </div>
      </div>
    </div>

    <!-- Notification Settings -->
    <div class="border-b border-gray-200 dark:border-gray-700 pb-8">
      <h2 class="text-2xl font-bold mb-6 dark:text-white">Notifications</h2>
      
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <Label class="text-lg font-semibold dark:text-gray-200">Push Notifications</Label>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Receive notifications about your video generation</p>
          </div>
          <Toggle bind:checked={notifications} />
        </div>

        <div class="flex items-center justify-between">
          <div>
            <Label class="text-lg font-semibold dark:text-gray-200">Email Updates</Label>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Receive updates and news via email</p>
          </div>
          <Toggle bind:checked={emailUpdates} />
        </div>
      </div>
    </div>

    <!-- Account Settings -->
    <div class="pb-8">
      <h2 class="text-2xl font-bold mb-6 dark:text-white">Account</h2>
      
      <div class="space-y-4">
        <Button color="red" class="w-full md:w-auto">Delete Account</Button>
        <p class="text-sm text-gray-500 dark:text-gray-400">Permanently delete your account and all associated data</p>
      </div>
    </div>

    <!-- Save Button -->
    <div class="flex gap-4 pt-4">
      <Button color="blue" class="w-full md:w-auto px-8 py-2" onclick={handleSaveSettings}>Save Settings</Button>
    </div>
  </div>
</div>
