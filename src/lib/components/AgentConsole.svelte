<script lang="ts">
  import { Timeline, TimelineItem, Card } from 'flowbite-svelte';
  import { CheckCircleSolid, ClockSolid, CodeBranchOutline, PenSolid, VideoCameraSolid, UploadSolid } from 'flowbite-svelte-icons';
  import { activeStepIndex, generationLogs, progress, isGenerating } from '$lib/stores/generation';
  import { fade } from 'svelte/transition';
  
  const steps = [
    { title: 'Planning Agent', icon: PenSolid },
    { title: 'Enhancing Prompt', icon: CodeBranchOutline },
    { title: 'Generating Scenes', icon: VideoCameraSolid },
    { title: 'Stitching Video', icon: UploadSolid }
  ];
</script>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-6xl mx-auto p-4 dark:text-white">
  <!-- Left Side: Timeline -->
  <div class="col-span-1 border-r border-gray-200 dark:border-gray-800 pr-4">
     <h2 class="text-xl font-bold mb-6">Agent Progress</h2>
     <Timeline order="vertical">
        {#each steps as step, i}
          <TimelineItem date={ $activeStepIndex > i ? 'Completed' : ($activeStepIndex === i ? 'Processing...' : 'Pending') }>
             <svelte:fragment slot="icon">
                {#if $activeStepIndex > i}
                   <CheckCircleSolid class="w-5 h-5 text-green-500" />
                {:else if $activeStepIndex === i}
                   <div class="relative flex items-center justify-center">
                     <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                     <svelte:component this={step.icon} class="relative w-5 h-5 text-secondary dark:text-secondary" />
                   </div>
                {:else}
                   <ClockSolid class="w-5 h-5 text-gray-400" />
                {/if}
             </svelte:fragment>
             <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{step.title}</h3>
          </TimelineItem>
        {/each}
     </Timeline>
  </div>

  <!-- Right Side: Terminal Agent Logs -->
  <div class="col-span-1 lg:col-span-2 flex flex-col gap-4">
     <Card size="xl" class="w-full bg-gray-900 text-green-400 font-mono shadow-2xl min-h-[400px] border-none !p-0 overflow-hidden relative">
        <div class="bg-gray-800 text-gray-400 p-2 text-xs flex justify-between border-b border-gray-700">
           <span>agent@terminal: ~</span>
           <span>bash (SSE Stream)</span>
        </div>
        <div class="p-4 h-full max-h-[350px] overflow-y-auto flex flex-col gap-2">
            {#each $generationLogs as log (log.id)}
               <div transition:fade class="text-sm">
                 <span class="text-gray-500">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                 <span class="text-blue-400">[{log.step}]</span>: <span class="text-gray-100">{log.message}</span>
               </div>
            {/each}
            {#if $isGenerating}
               <div class="animate-pulse">_</div>
            {/if}
        </div>
     </Card>

     <!-- Progress Bar -->
     <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-4 relative overflow-hidden">
        <div class="bg-secondary h-full" style="width: {$progress}%"></div>
     </div>
  </div>
</div>
