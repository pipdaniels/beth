<script lang="ts">
  import { page } from '$app/stores';
  import { fade, fly, slide } from 'svelte/transition';
  import { Label, Textarea, Card, Badge, Modal, Input } from 'flowbite-svelte';
  import { 
    PlusOutline, 
    TrashBinOutline, 
    CalendarMonthOutline, 
    ClockOutline, 
    PaperPlaneOutline,
    CheckCircleSolid,
    InfoCircleOutline
  } from 'flowbite-svelte-icons';
  import AppButton from '$lib/components/ui/AppButton.svelte';
  import { videos } from '$lib/stores/gallery';
  import { socialAccounts, socialPosts, socialStore } from '$lib/stores/social';

  // State management using Svelte 5 Runes
  let selectedAccountId = $state('acc-1');
  let selectedVideoId = $state('');
  let caption = $state('');
  let publishMode = $state<'now' | 'schedule'>('now');
  let scheduleDate = $state('');
  let scheduleTime = $state('');
  
  // Connection modal state
  let showConnectModal = $state(false);
  let newPlatform = $state<'tiktok' | 'instagram'>('tiktok');
  let newHandle = $state('');
  let isConnecting = $state(false);

  // Notification state
  let toastMessage = $state('');
  let showToast = $state(false);

  // Read videoId from query parameters (for direct redirection from gallery)
  let videoIdParam = $derived($page.url.searchParams.get('videoId'));
  
  $effect(() => {
    if (videoIdParam && $videos.some(v => v.id === videoIdParam)) {
      selectedVideoId = videoIdParam;
    }
  });

  // Derived variables
  let selectedAccount = $derived($socialAccounts.find(a => a.id === selectedAccountId));
  let selectedVideo = $derived($videos.find(v => v.id === selectedVideoId));
  let isFormValid = $derived(selectedAccountId && selectedVideoId && caption.trim().length > 0 && (publishMode === 'now' || (scheduleDate && scheduleTime)));

  // When switching to schedule mode, default date and time to current
  $effect(() => {
    if (publishMode === 'schedule') {
      if (!scheduleDate) {
        const now = new Date();
        // YYYY-MM-DD for date input
        scheduleDate = now.toISOString().slice(0, 10);
      }
      if (!scheduleTime) {
        const now = new Date();
        const pad = (n: number) => String(n).padStart(2, '0');
        scheduleTime = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
      }
    }
  });

  // Hashtag suggestions
  const tags = ['#AIArt', '#scifi', '#future', '#visuals', '#Beth', '#cyberpunk'];
  function addHashtag(tag: string) {
    if (!caption.includes(tag)) {
      caption = caption.trim() + ' ' + tag;
    }
  }

  // Trigger simulated connection
  async function handleConnectAccount(e: SubmitEvent) {
    e.preventDefault();
    if (!newHandle) return;
    
    isConnecting = true;
    await new Promise(r => setTimeout(r, 1200)); // Spinner animation delay
    
    socialStore.connectAccount(newPlatform, newHandle);
    
    // Reset and close
    isConnecting = false;
    showConnectModal = false;
    newHandle = '';
    
    triggerToast(`Successfully connected ${newPlatform === 'tiktok' ? 'TikTok' : 'Instagram'} account!`);
  }

  // Trigger publishing simulation
  function handlePublish() {
    if (!isFormValid || !selectedAccount || !selectedVideo) return;
    
    const schedTime = publishMode === 'schedule' ? `${scheduleDate} ${scheduleTime}` : undefined;
    
    socialStore.publishPost(
      selectedVideo.id,
      selectedVideo.prompt,
      selectedVideo.thumbnailUrl,
      selectedAccount.platform,
      selectedAccount.handle,
      caption,
      schedTime
    );
    
    const action = publishMode === 'schedule' ? 'scheduled for ' + schedTime : 'published';
    triggerToast(`Post successfully ${action}!`);
    
    // Reset form fields
    caption = '';
    publishMode = 'now';
    scheduleDate = '';
    scheduleTime = '';
  }

  function triggerToast(message: string) {
    toastMessage = message;
    showToast = true;
    setTimeout(() => {
      showToast = false;
    }, 4000);
  }
</script>

<svelte:head>
  <title>Social Hub | Beth</title>
</svelte:head>

<div class="max-w-6xl mx-auto py-8 px-4 animate-fade-in pb-24">
  <!-- Toast Notification -->
  {#if showToast}
    <div transition:fly={{ y: -20, duration: 400 }} class="fixed top-20 right-4 z-50 flex items-center p-4 mb-4 text-white bg-green-500 rounded-xl shadow-2xl border border-green-600 font-semibold" role="alert">
      <CheckCircleSolid class="w-5 h-5 mr-3" />
      <span>{toastMessage}</span>
    </div>
  {/if}

  <div class="mb-10">
    <h1 class="text-4xl font-extrabold text-gray-900 dark:text-white pb-2 flex items-center gap-3">
      Social Publishing Hub
    </h1>
    <p class="text-gray-500 dark:text-gray-400 text-lg mt-1">Directly publish or schedule your AI generation assets to connected channels.</p>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <!-- Left column: Composition Form -->
    <div class="lg:col-span-2 space-y-8">
      
      <!-- STEP 1: Select Channel -->
      <section class="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">1. Choose Social Channel</h2>
          <button onclick={() => showConnectModal = true} class="flex items-center text-sm font-semibold text-secondary hover:underline cursor-pointer">
            <PlusOutline class="w-4 h-4 mr-1" /> Connect Account
          </button>
        </div>
        
        {#if $socialAccounts.length === 0}
          <div class="p-6 text-center text-gray-500 italic bg-gray-50 dark:bg-gray-900 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
            No accounts connected yet. Click above to connect one!
          </div>
        {:else}
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {#each $socialAccounts as account (account.id)}
              <div 
                class="flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all duration-200 {selectedAccountId === account.id ? 'border-secondary bg-sky-50/30 dark:bg-sky-950/20' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'}"
              >
                <button 
                  type="button"
                  onclick={() => selectedAccountId = account.id} 
                  class="flex flex-1 items-center gap-3 text-left cursor-pointer outline-none focus:outline-none"
                >
                  <img src={account.avatarUrl} alt={account.handle} class="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700">
                  <div>
                    <p class="font-bold text-gray-900 dark:text-white text-sm">{account.handle}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 capitalize">{account.platform}</p>
                  </div>
                </button>
                
                <div class="flex items-center gap-2">
                  {#if account.platform === 'tiktok'}
                    <!-- TikTok SVG Logo -->
                    <svg class="w-5 h-5 text-black dark:text-white" fill="currentColor" viewBox="0 0 448 512">
                      <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/>
                    </svg>
                  {:else}
                    <!-- Instagram SVG Logo -->
                    <svg class="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 448 512">
                      <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/>
                    </svg>
                  {/if}
                  
                  <button 
                    type="button"
                    onclick={() => socialStore.disconnectAccount(account.id)} 
                    class="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer"
                    title="Disconnect account"
                  >
                    <TrashBinOutline class="w-4 h-4" />
                  </button>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </section>

      <!-- STEP 2: Select Video -->
      <section class="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">2. Select Generated Video</h2>
        
        {#if $videos.length === 0}
          <div class="p-8 text-center text-gray-500 italic bg-gray-50 dark:bg-gray-900 rounded-xl">
            No videos generated yet. Create a video first on the prompt page.
          </div>
        {:else}
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {#each $videos as video (video.id)}
              <button 
                onclick={() => selectedVideoId = video.id} 
                class="group relative aspect-video rounded-xl overflow-hidden border-2 text-left bg-gray-150 dark:bg-gray-900 transition-all duration-200 cursor-pointer {selectedVideoId === video.id ? 'border-secondary scale-[1.03] ring-4 ring-secondary/15' : 'border-transparent hover:border-gray-300 dark:hover:border-gray-700'}"
              >
                <img src={video.thumbnailUrl} alt={video.prompt} class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2 flex flex-col justify-end">
                  <p class="text-[10px] text-gray-300 line-clamp-2 leading-tight font-medium group-hover:text-white">{video.prompt}</p>
                  <p class="text-[9px] text-secondary mt-1 font-bold">{video.duration}s</p>
                </div>
              </button>
            {/each}
          </div>
        {/if}
      </section>

      <!-- STEP 3: Compose Post -->
      <section class="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">3. Compose & Schedule</h2>
        
        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <Label for="caption" class="text-sm font-semibold dark:text-gray-200">Post Caption</Label>
            <span class="text-xs text-gray-400 font-mono">{caption.length}/2200 characters</span>
          </div>
          <Textarea id="caption" bind:value={caption} rows={8} placeholder="Write a catchy caption, add relevant hashtags..." class="w-full h-24 resize-none dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-secondary focus:border-secondary" />
          
          <div class="flex flex-wrap gap-2 pt-2">
            <span class="text-xs text-gray-400 self-center mr-1">Hot tags:</span>
            {#each tags as tag}
              <button 
                onclick={() => addHashtag(tag)}
                class="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-650 text-gray-700 dark:text-gray-300 text-xs font-medium transition-colors cursor-pointer"
              >
                {tag}
              </button>
            {/each}
          </div>
        </div>

        <hr class="border-gray-100 dark:border-gray-700">

        <!-- Publish Options -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          <div class="space-y-3">
            <span class="text-sm font-semibold dark:text-gray-200 block">Publish Time</span>
            <div class="flex gap-4">
              <button 
                onclick={() => publishMode = 'now'} 
                class="flex-1 py-2.5 rounded-xl border text-sm font-bold transition-all duration-200 cursor-pointer {publishMode === 'now' ? 'bg-secondary text-white border-secondary' : 'bg-transparent text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900'}"
              >
                Immediately
              </button>
              <button 
                onclick={() => publishMode = 'schedule'} 
                class="flex-1 py-2.5 rounded-xl border text-sm font-bold transition-all duration-200 cursor-pointer {publishMode === 'schedule' ? 'bg-secondary text-white border-secondary' : 'bg-transparent text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900'}"
              >
                Schedule
              </button>
            </div>
          </div>

          {#if publishMode === 'schedule'}
            <div class="grid grid-cols-2 gap-2" transition:slide={{ duration: 200 }}>
              <div>
                <Label for="sch-date" class="text-xs mb-1 dark:text-gray-400">Date</Label>
                <div class="relative">
                  <Input type="date" id="sch-date" bind:value={scheduleDate} class="py-2 pl-8 text-sm focus:ring-secondary focus:border-secondary" />
                  <CalendarMonthOutline class="w-4 h-4 text-gray-400 absolute left-2.5 top-3" />
                </div>
              </div>
              <div>
                <Label for="sch-time" class="text-xs mb-1 dark:text-gray-400">Time</Label>
                <div class="relative">
                  <Input type="time" id="sch-time" bind:value={scheduleTime} class="py-2 pl-8 text-sm focus:ring-secondary focus:border-secondary" />
                  <ClockOutline class="w-4 h-4 text-gray-400 absolute left-2.5 top-3" />
                </div>
              </div>
            </div>
          {/if}
        </div>

        <AppButton 
          variant="secondary" 
          class="w-full py-3.5 text-base font-bold shadow-md cursor-pointer" 
          disabled={!isFormValid} 
          onclick={handlePublish}
        >
          <PaperPlaneOutline class="w-5 h-5 mr-2" />
          {publishMode === 'now' ? 'Publish Masterpiece' : 'Schedule Social Post'}
        </AppButton>
      </section>
    </div>

    <!-- Right column: Sidebar (Selected Preview & Post History) -->
    <div class="space-y-8">
      
      <!-- Current selection details card -->
      <Card class="w-full p-4 space-y-4 dark:bg-gray-800 border-gray-150 dark:border-gray-750">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">Active Share Preview</h3>
        
        {#if selectedVideo}
          <div class="aspect-video relative rounded-xl overflow-hidden bg-black mb-3">
            <img src={selectedVideo.thumbnailUrl} alt={selectedVideo.prompt} class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span class="px-3 py-1 bg-black/60 rounded-full text-xs text-white backdrop-blur-sm">Ready to post</span>
            </div>
          </div>
          
          <div class="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <p class="line-clamp-3 italic">"{selectedVideo.prompt}"</p>
            <div class="flex justify-between items-center text-xs border-t border-gray-100 dark:border-gray-700 pt-2">
              <span>Channel: <strong class="text-gray-900 dark:text-white">{selectedAccount?.handle || 'None'}</strong></span>
              <span class="capitalize text-secondary font-bold">{selectedAccount?.platform || ''}</span>
            </div>
          </div>
        {:else}
          <div class="py-12 text-center text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl flex flex-col items-center justify-center gap-2">
            <InfoCircleOutline class="w-8 h-8 text-gray-300" />
            <p class="text-xs px-4">Select a video and account to render the live publishing preview.</p>
          </div>
        {/if}
      </Card>

      <!-- Post History List -->
      <section class="space-y-4">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">Sharing Pipeline History</h3>
        
        {#if $socialPosts.length === 0}
          <p class="text-sm text-gray-400 italic">No share history recorded yet.</p>
        {:else}
          <div class="space-y-3">
            {#each $socialPosts as post (post.id)}
              <div transition:slide class="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-150 dark:border-gray-700 flex gap-3 shadow-xs">
                <img src={post.thumbnailUrl} alt={post.videoPrompt} class="w-16 h-16 rounded-lg object-cover flex-shrink-0 bg-gray-100">
                <div class="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div class="flex items-center justify-between gap-1 mb-1">
                      <span class="text-[10px] font-mono text-gray-400 truncate">{post.accountHandle}</span>
                      <Badge color={post.status === 'published' ? 'green' : 'indigo'} class="text-[9px] px-1.5 py-0.5 font-bold uppercase rounded-md">
                        {post.status}
                      </Badge>
                    </div>
                    <p class="text-xs text-gray-800 dark:text-gray-200 line-clamp-2 leading-snug">{post.caption}</p>
                  </div>
                  
                  <div class="flex justify-between items-center text-[9px] text-gray-400 pt-1 border-t border-gray-100 dark:border-gray-750">
                    <span class="capitalize text-gray-500 font-bold">{post.platform}</span>
                    <span>
                      {#if post.status === 'scheduled' && post.scheduledTime}
                        {post.scheduledTime}
                      {:else}
                        {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {/if}
                    </span>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </section>
    </div>
  </div>
</div>

<!-- Connect Account Modal (Simulated) -->
<Modal bind:open={showConnectModal} size="xs" outsideclose title="Connect Social Channel" class="p-6">
  <form onsubmit={handleConnectAccount} class="space-y-6">
    <div class="space-y-2">
      <Label for="platform-sel" class="text-sm font-semibold">Social Network</Label>
      <div class="flex gap-4">
        <button 
          type="button"
          onclick={() => newPlatform = 'tiktok'} 
          class="flex-1 py-3 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 cursor-pointer {newPlatform === 'tiktok' ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white' : 'bg-transparent text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50'}"
        >
          TikTok
        </button>
        <button 
          type="button"
          onclick={() => newPlatform = 'instagram'} 
          class="flex-1 py-3 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 cursor-pointer {newPlatform === 'instagram' ? 'bg-pink-650 text-white border-pink-650' : 'bg-transparent text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50'}"
        >
          Instagram
        </button>
      </div>
    </div>

    <div class="space-y-2">
      <Label for="handle-input" class="text-sm font-semibold">Account Handle</Label>
      <Input type="text" id="handle-input" bind:value={newHandle} placeholder="@username" required class="focus:ring-secondary focus:border-secondary dark:bg-gray-800" />
      <p class="text-[10px] text-gray-400 dark:text-gray-500">Provide any handle for prototype registration.</p>
    </div>

    <AppButton variant="secondary" type="submit" class="w-full mt-4" disabled={isConnecting}>
      {#if isConnecting}
        <!-- Simple Spinner -->
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Connecting...
      {:else}
        Authenticate & Link
      {/if}
    </AppButton>
  </form>
</Modal>
