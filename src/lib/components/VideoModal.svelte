<script lang="ts">
  import { Modal } from 'flowbite-svelte';
  import AppButton from '$lib/components/ui/AppButton.svelte';
  import { DownloadOutline } from 'flowbite-svelte-icons';
  import type { PastVideo } from '../types';

  let { showModal = $bindable(false), selectedVideo = null }: { showModal: boolean, selectedVideo: PastVideo | null } = $props();
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
         <div class="flex justify-end">
            <!-- Simulating direct download from R2 signed link -->
            <AppButton href={selectedVideo.videoUrl} target="_blank" download variant="primary" class="w-full sm:w-auto">
                <DownloadOutline class="w-5 h-5 mr-2" /> Download MP4
            </AppButton>
         </div>
      </div>
    </div>
  {/if}
</Modal>
