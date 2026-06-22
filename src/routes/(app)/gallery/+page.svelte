<script lang="ts">
  import MasonryGallery from '$lib/components/MasonryGallery.svelte';
  import VideoModal from '$lib/components/VideoModal.svelte';
  import { videos } from '$lib/stores/gallery';
  import type { PastVideo } from '$lib/types';

  let selectedVideo: PastVideo | null = $state(null);
  let showModal = $state(false);

  function handlePlay(video: PastVideo) {
     selectedVideo = video;
     showModal = true;
  }
</script>

<svelte:head>
  <title>Gallery | Beth</title>
</svelte:head>

<div class="max-w-6xl mx-auto py-8">
   <div class="mb-10">
     <h1 class="text-4xl font-extrabold text-gray-900 dark:text-white pb-2">Your Output Gallery</h1>
     <p class="text-gray-500 dark:text-gray-400 text-lg mt-1">Review, download, and manage your past cinematic generations.</p>
   </div>

   {#if $videos.length === 0}
     <p class="text-gray-500 italic p-8 text-center bg-gray-50 dark:bg-gray-800 rounded-lg">No videos generated yet. Head over to the Prompt page!</p>
   {:else}
     <MasonryGallery videos={$videos} onPlay={handlePlay} />
   {/if}

   <VideoModal bind:showModal {selectedVideo} />
</div>
