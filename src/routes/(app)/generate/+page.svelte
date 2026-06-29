<script lang="ts">
  import AgentConsole from '$lib/components/AgentConsole.svelte';
  import { onMount } from 'svelte';
  import { jobStatus, generationLogs, progress, currentPrompt, currentDuration } from '$lib/stores/generation';
  import { galleryStore } from '$lib/stores/gallery';
  import { get } from 'svelte/store';
  import { creditBalance } from '$lib/stores/billing';
  import AppButton from '$lib/components/ui/AppButton.svelte';
  import { ArrowLeftOutline } from 'flowbite-svelte-icons';

  onMount(() => {
     // Mocking the SSE stream using a timed sequence
     jobStatus.set('planning');
     progress.set(10);
     generationLogs.set([{ id: '1', timestamp: Date.now(), step: 'planning', message: 'Analyzing prompt parameters and style requirements...' }]);

     const t1 = setTimeout(() => {
        jobStatus.set('enhancing');
        progress.set(30);
        generationLogs.update(l => [...l, { id: '2', timestamp: Date.now(), step: 'enhancing', message: 'Injecting cinematic keywords and lighting descriptors.' }]);
     }, 2000);

     const t2 = setTimeout(() => {
        jobStatus.set('generating');
        progress.set(65);
        generationLogs.update(l => [...l, { id: '3', timestamp: Date.now(), step: 'generating', message: 'Calling Veo 3.0 via Vertex. Estimated wait 10s...' }]);
     }, 4500);

     const t3 = setTimeout(() => {
        jobStatus.set('stitching');
        progress.set(85);
        generationLogs.update(l => [...l, { id: '4', timestamp: Date.now(), step: 'stitching', message: 'Merging chunks and layering ambient soundscape via FFmpeg.' }]);
     }, 8000);

     const t4 = setTimeout(() => {
        jobStatus.set('completed');
        progress.set(100);
        generationLogs.update(l => [...l, { id: '5', timestamp: Date.now(), step: 'completed', message: 'Render complete. Updating R2 bucket and catalog.' }]);
        
        const promptVal = get(currentPrompt) || 'Cinematic wide shot of a futuristic metropolis, flying cars, rain...';
        const durationVal = get(currentDuration) || 10;
        
        // Deduct based on dynamic duration
        creditBalance.update(b => Math.max(0, b - durationVal));

        // Select a random thumbnail from the newly generated local assets
        const thumbs = ['/thumbnails/metropolis.png', '/thumbnails/neon_eye.png', '/thumbnails/alien_desert.png', '/thumbnails/glowing_mushroom.png'];
        const randomThumb = thumbs[Math.floor(Math.random() * thumbs.length)];

        // Append to local gallery store
        galleryStore.addVideo({
           id: 'vid-' + Date.now(),
           prompt: promptVal,
           duration: durationVal,
           creditsUsed: durationVal,
           createdAt: Date.now(),
           thumbnailUrl: randomThumb,
           videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
        });
     }, 11000);
     
     return () => {
         clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4);
         jobStatus.set('idle');
         progress.set(0);
         generationLogs.set([]);
     }
  });
</script>

<svelte:head>
  <title>Generating | GPTexist</title>
</svelte:head>

<div class="max-w-6xl mx-auto h-full flex flex-col py-8 animate-fade-in">
  <div class="flex items-center justify-between mb-8">
    <div>
        <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white pb-2 flex items-center gap-3">
           Active Generation Hub
           {#if $jobStatus !== 'completed' && $jobStatus !== 'idle'}
              <span class="relative flex h-3 w-3">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
              </span>
           {/if}
        </h1>
        <p class="text-gray-500 dark:text-gray-400">Watch the AI agent orchestrate your video pipeline.</p>
    </div>
    {#if $jobStatus === 'completed'}
      <AppButton href="/gallery" variant="secondary">View in Gallery <ArrowLeftOutline class="ml-2 w-4 h-4 rotate-180" /></AppButton>
    {/if}
  </div>
  
  <AgentConsole />
</div>
