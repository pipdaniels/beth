<script lang="ts">
  import MasonryGallery from '$lib/components/MasonryGallery.svelte';
  import VideoModal from '$lib/components/VideoModal.svelte';
  import type { PastVideo } from '$lib/types';

  let videos: PastVideo[] = [
    { id: '1', prompt: 'Cinematic wide shot of a futuristic metropolis, flying cars, rain...', duration: 10, creditsUsed: 10, createdAt: Date.now(), thumbnailUrl: 'https://images.unsplash.com/photo-1542382103-6058cbd9ebfd?q=80&w=800&auto=format&fit=crop', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { id: '2', prompt: 'Close up of a neon glowing eye, cyberpunk street reflection.', duration: 5, creditsUsed: 5, createdAt: Date.now() - 86400000, thumbnailUrl: 'https://images.unsplash.com/photo-1515233158066-e8d12fb84a86?q=80&w=600&auto=format&fit=crop', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { id: '3', prompt: 'Drone shot flying over an alien desert landscape at sunset, massive moons in the sky.', duration: 15, creditsUsed: 15, createdAt: Date.now() - 172800000, thumbnailUrl: 'https://images.unsplash.com/photo-1549488344-c1044be25b41?q=80&w=600&auto=format&fit=crop', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { id: '4', prompt: 'Time lapse of a mushroom growing and glowing in a dark forest floor.', duration: 8, creditsUsed: 8, createdAt: Date.now() - 172800000, thumbnailUrl: 'https://images.unsplash.com/photo-1608681285265-6677f5022e39?q=80&w=600&auto=format&fit=crop', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  ];

  let selectedVideo: PastVideo | null = null;
  let showModal = false;

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

   {#if videos.length === 0}
     <p class="text-gray-500 italic p-8 text-center bg-gray-50 dark:bg-gray-800 rounded-lg">No videos generated yet. Head over to the Prompt page!</p>
   {:else}
     <MasonryGallery {videos} onPlay={handlePlay} />
   {/if}

   <VideoModal bind:showModal {selectedVideo} />
</div>
