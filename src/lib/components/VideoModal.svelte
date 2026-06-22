<script lang="ts">
  import { Modal, Label, Textarea, Input } from 'flowbite-svelte';
  import AppButton from '$lib/components/ui/AppButton.svelte';
  import { 
    DownloadOutline, 
    PaperPlaneOutline, 
    CheckCircleSolid, 
    CalendarMonthOutline, 
    ClockOutline,
    InfoCircleOutline
  } from 'flowbite-svelte-icons';
  import { slide } from 'svelte/transition';
  import type { PastVideo } from '../types';
  import { socialAccounts, socialStore } from '$lib/stores/social';

  let { showModal = $bindable(false), selectedVideo = null }: { showModal: boolean, selectedVideo: PastVideo | null } = $props();

  // Local state for publishing
  let showPublishForm = $state(false);
  let selectedAccountId = $state('');
  let caption = $state('');
  let publishMode = $state<'now' | 'schedule'>('now');
  let scheduleDate = $state('');
  let scheduleTime = $state('');
  let isPublished = $state(false);
  let publishMessage = $state('');

  // Automatically update states when a video is selected
  $effect(() => {
    if (selectedVideo) {
      caption = `Created an amazing clip with Beth: "${selectedVideo.prompt.slice(0, 60)}..." #AI #beth`;
      showPublishForm = false;
      isPublished = false;
      publishMessage = '';
      if ($socialAccounts.length > 0) {
        selectedAccountId = $socialAccounts[0].id;
      }
    }
  });

  let selectedAccount = $derived($socialAccounts.find(a => a.id === selectedAccountId));
  let isFormValid = $derived(selectedAccountId && caption.trim().length > 0 && (publishMode === 'now' || (scheduleDate && scheduleTime)));

  function handleQuickPublish() {
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

    isPublished = true;
    publishMessage = publishMode === 'schedule' 
      ? `Successfully scheduled post on ${selectedAccount.handle} (${selectedAccount.platform}) for ${schedTime}!`
      : `Successfully published post to ${selectedAccount.handle} (${selectedAccount.platform})!`;

    setTimeout(() => {
      showPublishForm = false;
    }, 2500);
  }
</script>

<Modal bind:open={showModal} size="xl" outsideclose title="Video Preview">
  {#if selectedVideo}
    <div class="flex flex-col rounded-lg overflow-hidden relative group bg-gray-900">
      <video src={selectedVideo.videoUrl} controls class="w-full h-auto max-h-[70vh] shadow-lg" autoplay>
         <!-- Add standard track to remove warnings, even if empty -->
         <track kind="captions" />
      </video>
      <div class="p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
         <p class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">"{selectedVideo.prompt}"</p>
         
         <div class="flex flex-col sm:flex-row sm:justify-between items-center gap-4">
            <div class="flex gap-2 w-full sm:w-auto">
               <AppButton variant="outline" onclick={() => showPublishForm = !showPublishForm} class="w-full sm:w-auto cursor-pointer">
                   <PaperPlaneOutline class="w-5 h-5 mr-2 text-secondary" /> Share to Socials
               </AppButton>
            </div>
            
            <!-- Simulating direct download from R2 signed link -->
            <AppButton href={selectedVideo.videoUrl} target="_blank" download variant="primary" class="w-full sm:w-auto cursor-pointer">
                <DownloadOutline class="w-5 h-5 mr-2" /> Download MP4
            </AppButton>
         </div>

         <!-- Quick Publish Section -->
         {#if showPublishForm}
           <div transition:slide class="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4 text-left">
              <div class="flex justify-between items-center">
                 <h4 class="text-md font-bold text-gray-900 dark:text-white">Quick Publish</h4>
                 <a href="/publish?videoId={selectedVideo.id}" class="text-xs text-secondary hover:underline font-semibold cursor-pointer">Open Social Dashboard</a>
              </div>

              {#if isPublished}
                 <div class="p-4 bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 rounded-xl flex items-center gap-2" transition:slide>
                    <CheckCircleSolid class="w-5 h-5" />
                    <span class="text-sm font-semibold">{publishMessage}</span>
                 </div>
              {:else if $socialAccounts.length === 0}
                 <div class="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-xl flex items-center gap-3">
                    <InfoCircleOutline class="w-5 h-5 text-gray-400" />
                    <div class="text-xs text-gray-500">
                       No social accounts linked yet. <a href="/publish" class="text-secondary hover:underline font-bold">Connect an account</a> first on the Social Hub page.
                    </div>
                 </div>
              {:else}
                 <div class="space-y-4">
                    <!-- Choose Account -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                       {#each $socialAccounts as account (account.id)}
                          <button 
                             onclick={() => selectedAccountId = account.id} 
                             class="flex items-center justify-between p-3 rounded-lg border-2 text-left transition-all duration-200 cursor-pointer {selectedAccountId === account.id ? 'border-secondary bg-sky-50/20 dark:bg-sky-950/20' : 'border-gray-200 dark:border-gray-750 hover:border-gray-300 dark:hover:border-gray-650 bg-white dark:bg-gray-800'}"
                          >
                             <div class="flex items-center gap-2">
                                <img src={account.avatarUrl} alt={account.handle} class="w-7 h-7 rounded-full object-cover">
                                <span class="text-xs font-bold text-gray-800 dark:text-gray-200">{account.handle}</span>
                             </div>
                             <span class="text-[9px] uppercase font-bold text-gray-400">{account.platform}</span>
                          </button>
                       {/each}
                    </div>

                    <!-- Caption -->
                    <div>
                       <Label for="quick-caption" class="text-xs mb-1 font-semibold dark:text-gray-300">Caption</Label>
                       <Textarea id="quick-caption" bind:value={caption} rows={3} placeholder="Write something..." class="text-xs dark:bg-gray-900 border-gray-250 dark:border-gray-700" />
                    </div>

                    <!-- Schedule Selector -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                       <div>
                          <Label class="text-xs font-semibold mb-1 dark:text-gray-300">Post Time</Label>
                          <div class="flex gap-2">
                             <button 
                                onclick={() => publishMode = 'now'} 
                                class="flex-1 py-1.5 rounded-lg border text-xs font-bold transition-all duration-200 cursor-pointer {publishMode === 'now' ? 'bg-secondary text-white border-secondary' : 'bg-transparent text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50'}"
                             >
                                Immediately
                             </button>
                             <button 
                                onclick={() => publishMode = 'schedule'} 
                                class="flex-1 py-1.5 rounded-lg border text-xs font-bold transition-all duration-200 cursor-pointer {publishMode === 'schedule' ? 'bg-secondary text-white border-secondary' : 'bg-transparent text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50'}"
                             >
                                Schedule
                             </button>
                          </div>
                       </div>

                       {#if publishMode === 'schedule'}
                          <div class="grid grid-cols-2 gap-2" transition:slide>
                             <div>
                                <Input type="date" bind:value={scheduleDate} class="py-1 px-2 text-xs focus:ring-secondary focus:border-secondary" />
                             </div>
                             <div>
                                <Input type="time" bind:value={scheduleTime} class="py-1 px-2 text-xs focus:ring-secondary focus:border-secondary" />
                             </div>
                          </div>
                       {/if}
                    </div>

                    <AppButton variant="secondary" size="sm" class="w-full font-bold cursor-pointer" disabled={!isFormValid} onclick={handleQuickPublish}>
                       Publish Post
                    </AppButton>
                 </div>
              {/if}
           </div>
         {/if}
      </div>
    </div>
  {/if}
</Modal>
