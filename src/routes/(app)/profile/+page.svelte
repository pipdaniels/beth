<script lang="ts">
  import { Button, Input, Label } from 'flowbite-svelte';
  import { userSession } from '$lib/stores/auth';
  import { UserCircleOutline } from 'flowbite-svelte-icons';

  let fullName = $state($userSession?.name || 'User');
  let email = $state($userSession?.email || 'user@example.com');
  let bio = $state('Creator and visual artist');

  function handleSaveProfile() {
    // Handle profile save logic here
    alert('Profile updated successfully!');
  }
</script>

<svelte:head>
  <title>Beth | Profile</title>
</svelte:head>

<div class="max-w-3xl mx-auto py-8 animate-fade-in">
  <h1 class="text-4xl md:text-5xl font-extrabold bg-clip-text bg-primary pb-4 mb-8">Profile</h1>

  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8 space-y-8">
    <!-- Profile Header -->
    <div class="flex flex-col md:flex-row items-center md:items-start gap-6 border-b border-gray-200 dark:border-gray-700 pb-8">
      <div class="flex-shrink-0">
        <div class="w-24 h-24 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
          <UserCircleOutline class="w-16 h-16 text-white" />
        </div>
      </div>
      
      <div class="flex-1">
        <h2 class="text-2xl font-bold dark:text-white">{fullName}</h2>
        <p class="text-gray-500 dark:text-gray-400 mt-1">{email}</p>
        <p class="text-gray-600 dark:text-gray-300 mt-3">{bio}</p>
      </div>

      <Button color="blue" class="md:self-end px-6 py-2">Change Avatar</Button>
    </div>

    <!-- Profile Information -->
    <div>
      <h3 class="text-xl font-bold mb-6 dark:text-white">Personal Information</h3>
      
      <div class="space-y-6">
        <div>
          <Label for="fullname" class="mb-2 block text-sm font-medium dark:text-gray-200">Full Name</Label>
          <Input id="fullname" type="text" bind:value={fullName} placeholder="Your full name" class="!border-gray-300 dark:!bg-gray-700 dark:!border-gray-600" />
        </div>

        <div>
          <Label for="email" class="mb-2 block text-sm font-medium dark:text-gray-200">Email Address</Label>
          <Input id="email" type="email" bind:value={email} placeholder="your.email@example.com" disabled class="!border-gray-300 dark:!bg-gray-700 dark:!border-gray-600" />
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Email cannot be changed</p>
        </div>

        <div>
          <Label for="bio" class="mb-2 block text-sm font-medium dark:text-gray-200">Bio</Label>
          <textarea id="bio" bind:value={bio} placeholder="Tell us about yourself" rows="4" class="w-full px-4 py-2 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary dark:text-white resize-none"></textarea>
        </div>
      </div>
    </div>

    <!-- Account Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-200 dark:border-gray-700 pt-8">
      <div class="text-center md:text-left">
        <p class="text-gray-500 dark:text-gray-400 text-sm">Videos Created</p>
        <p class="text-3xl font-bold text-primary mt-2">24</p>
      </div>
      <div class="text-center md:text-left">
        <p class="text-gray-500 dark:text-gray-400 text-sm">Total Credits Used</p>
        <p class="text-3xl font-bold text-secondary mt-2">480s</p>
      </div>
      <div class="text-center md:text-left">
        <p class="text-gray-500 dark:text-gray-400 text-sm">Member Since</p>
        <p class="text-lg font-bold dark:text-white mt-2">Jan 2026</p>
      </div>
    </div>

    <!-- Save Button -->
    <div class="flex gap-4 pt-4">
      <Button color="blue" class="w-full md:w-auto px-8 py-2" onclick={handleSaveProfile}>Save Profile</Button>
    </div>
  </div>
</div>
