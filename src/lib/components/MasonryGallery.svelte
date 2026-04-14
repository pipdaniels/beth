<script lang="ts">
  import { Card } from 'flowbite-svelte';
  import { PlaySolid } from 'flowbite-svelte-icons';
  import { fly, fade } from 'svelte/transition';
  import type { PastVideo } from '../types';

  let { videos = [], onPlay = () => {} }: { videos: PastVideo[], onPlay: (video: PastVideo) => void } = $props();
</script>

<!-- CSS Columns approach -->
<div class="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
   {#each videos as video (video.id)}
     <button class="block w-full break-inside-avoid relative group text-left" in:fly={{ y: 20, duration: 400 }} out:fade onclick={() => onPlay(video)}>
       <Card class="w-full overflow-hidden p-0 border-none shadow bg-white dark:bg-gray-800 relative cursor-pointer hover:scale-[1.02] transform transition-transform duration-300">
           <img src={video.thumbnailUrl} alt={video.prompt} class="w-full h-auto object-cover max-h-96">
           <div class="absolute top-0 left-0 right-0 bottom-[80px] bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
              <PlaySolid class="w-12 h-12 text-white" />
           </div>
           <div class="p-4 space-y-2 border-t border-gray-100 dark:border-gray-700">
              <p class="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-2 leading-relaxed">{video.prompt}</p>
              <div class="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                 <span class="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{video.duration}s</span>
                 <span class="text-blue-500 font-semibold">-{video.creditsUsed} ★</span>
              </div>
           </div>
       </Card>
     </button>
   {/each}
</div>
