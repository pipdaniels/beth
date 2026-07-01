<script lang="ts">
  import { goto } from '$app/navigation';
  import { Textarea, Label, Select } from 'flowbite-svelte';
  import AppButton from '$lib/components/ui/AppButton.svelte';
  import CreditEstimateWidget from '$lib/components/CreditEstimateWidget.svelte';
  import { ArrowRightOutline } from 'flowbite-svelte-icons';
  import { creditBalance } from '$lib/stores/billing';
  import {
    currentFirstFrame,
    currentGenerationMode,
    currentLength,
    currentLastFrame,
    currentModel,
    currentPrompt,
    currentDuration
  } from '$lib/stores/generation';
  import type { GenerationFrame, GenerationLength, GenerationMode, GenerationModel } from '$lib/types';

  const generationTabs: { id: GenerationMode; label: string; eyebrow: string; description: string }[] = [
    { id: 'text', label: 'Text Exist', eyebrow: 'Write', description: 'Draft copy, scripts, and structured text.' },
    { id: 'image', label: 'Image Exist', eyebrow: 'Create', description: 'Generate images, concepts, and visuals.' },
    { id: 'video', label: 'Video Exist', eyebrow: 'Animate', description: 'Generate motion with optional frame guidance.' }
  ];

  const lengthOptions: { value: GenerationLength; label: string; description: string }[] = [
    { value: 'short', label: 'Short', description: 'Fast, concise output.' },
    { value: 'medium', label: 'Medium', description: 'Balanced depth and detail.' },
    { value: 'long', label: 'Long', description: 'More expansive generation.' }
  ];

  const textModels: GenerationModel[] = ['gpt-4.1', 'gpt-4o', 'claude-3.7-sonnet', 'gemini-2.5-pro'];
  const imageModels: GenerationModel[] = ['gpt-4.1', 'gpt-4o', 'gemini-2.5-pro', 'claude-3.7-sonnet'];
  const videoModels: GenerationModel[] = ['grok-3', 'gemini-2.5-pro', 'seedance', 'kling-2.1', 'kling-2.2'];

  let promptText = $state('');
  let duration = $state(10);
  let selectedMode = $state<GenerationMode>('video');
  let selectedLength = $state<GenerationLength>('medium');
  let selectedModel = $state<GenerationModel>('grok-3');
  let firstFrame = $state<GenerationFrame | null>(null);
  let lastFrame = $state<GenerationFrame | null>(null);

  let isValidPrompt = $derived(promptText.trim().length > 5);
  let hasEnoughCredits = $derived($creditBalance >= duration);
  let modelOptions = $derived(
    selectedMode === 'text'
      ? textModels
      : selectedMode === 'image'
        ? imageModels
        : videoModels
  );

  $effect(() => {
    if (!modelOptions.includes(selectedModel)) {
      selectedModel = modelOptions[0];
    }
  });

  function frameFromFile(file: File | null, label: string): GenerationFrame | null {
    if (!file) return null;
    return {
      file,
      label,
      previewUrl: URL.createObjectURL(file)
    };
  }

  function handleFrameChange(event: Event, label: string, target: 'first' | 'last') {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    const frame = frameFromFile(file, label);

    if (target === 'first') {
      if (firstFrame?.previewUrl) URL.revokeObjectURL(firstFrame.previewUrl);
      firstFrame = frame;
    } else {
      if (lastFrame?.previewUrl) URL.revokeObjectURL(lastFrame.previewUrl);
      lastFrame = frame;
    }
  }

  function startGeneration() {
    currentPrompt.set(promptText);
    currentDuration.set(duration);
    currentGenerationMode.set(selectedMode);
    currentLength.set(selectedLength);
    currentModel.set(selectedModel);
    currentFirstFrame.set(firstFrame);
    currentLastFrame.set(lastFrame);
    goto('/generate');
  }

  $effect(() => {
    return () => {
      if (firstFrame?.previewUrl) URL.revokeObjectURL(firstFrame.previewUrl);
      if (lastFrame?.previewUrl) URL.revokeObjectURL(lastFrame.previewUrl);
    };
  });
</script>

<svelte:head>
  <title>GPTexist | Generate</title>
</svelte:head>

<div class="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-4 sm:px-6 lg:px-8 lg:py-8 animate-fade-in">
  <section class="space-y-3">
    <div class="inline-flex items-center rounded-full border border-secondary/20 bg-secondary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-secondary">
      GPTexist Generator
    </div>
    <!-- <div class="space-y-2">
      <h1 class="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
        What should we create today?
      </h1>
      <p class="max-w-2xl text-sm text-gray-500 dark:text-gray-400 sm:text-base">
        Switch between text, image, and video generation, then fine-tune the length, model, and creative inputs before you launch.
      </p>
    </div> -->
  </section>

  <section class="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)]">
    <div class="space-y-5">
      <div class="rounded-3xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {#each generationTabs as tab}
            <button
              type="button"
              onclick={() => {
                selectedMode = tab.id;
                selectedModel = tab.id === 'video' ? 'grok-3' : tab.id === 'image' ? 'gpt-4o' : 'gpt-4.1';
              }}
              class={`rounded-2xl border px-4 py-3 text-left transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-secondary/20 ${
                selectedMode === tab.id
                  ? 'border-secondary/40 bg-gradient-to-br from-secondary/10 to-slate-50 shadow-lg dark:from-secondary/15 dark:to-gray-800'
                  : 'border-gray-200 bg-white hover:border-secondary/30 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800'
              }`}
            >
              <p class="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400">
                {tab.eyebrow}
              </p>
              <p class="mt-1 text-base font-bold text-gray-900 dark:text-white">{tab.label}</p>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{tab.description}</p>
            </button>
          {/each}
        </div>
      </div>

      <div class="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
        <div class="flex items-center justify-between gap-3">
          <Label for="prompt-area" class="text-base font-semibold text-gray-900 dark:text-white sm:text-lg">
            {selectedMode === 'text' ? 'Text Prompt' : selectedMode === 'image' ? 'Image Prompt' : 'Video Prompt'}
          </Label>
          <span class="text-xs font-medium uppercase tracking-[0.2em] text-gray-400">
            Step 1
          </span>
        </div>
        <Textarea
          id="prompt-area"
          bind:value={promptText}
          rows={8}
          placeholder={selectedMode === 'text'
            ? 'Write the copy, article, thread, or script you want GPTexist to generate...'
            : selectedMode === 'image'
              ? 'Describe the scene, subject, style, lighting, and composition you want to generate...'
              : 'Describe the shot, movement, visual mood, and story beats for your video...'}
          class="mt-3 w-full resize-none border-gray-300 bg-gray-50 text-base shadow-sm focus:border-secondary focus:ring-secondary dark:border-gray-700 dark:bg-gray-800 sm:text-lg"
        />

        <div class="mt-5 grid gap-4 sm:grid-cols-2">
          <!-- <div class="space-y-2">
            <Label class="text-sm font-semibold text-gray-900 dark:text-white">Length</Label>
            <Select bind:value={selectedLength} class="w-full">
              {#each lengthOptions as option}
                <option value={option.value}>{option.label} - {option.description}</option>
              {/each}
            </Select>
          </div> -->

          <div class="space-y-2">
            <Label class="text-sm font-semibold text-gray-900 dark:text-white">LLM / Model</Label>
            <Select bind:value={selectedModel} class="w-full">
              {#each modelOptions as model}
                <option value={model}>
                  {#if model === 'gpt-4.1'}GPT-4.1
                  {:else if model === 'gpt-4o'}GPT-4o
                  {:else if model === 'claude-3.7-sonnet'}Claude 3.7 Sonnet
                  <!-- {:else if model === 'gemini-2.5-pro'}Gemini 2.5 Pro -->
                  {:else if model === 'grok-3'}Grok
                  {:else if model === 'seedance'}Seedance
                  {:else if model === 'kling-2.1'}Kling 2.1
                  {:else}Kling 2.2{/if}
                </option>
              {/each}
            </Select>
          </div>
        </div>

        {#if selectedMode === 'video'}
          <div class="mt-5 grid gap-4 sm:grid-cols-2">
            <div class="space-y-2">
              <Label class="text-sm font-semibold text-gray-900 dark:text-white">First Frame</Label>
              <input
                type="file"
                accept="image/*"
                class="block w-full cursor-pointer rounded-xl border border-dashed border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:border-secondary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                onchange={(event) => handleFrameChange(event, 'First frame', 'first')}
              />
              {#if firstFrame}
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Selected: {firstFrame.file?.name}
                </p>
              {/if}
            </div>

            <div class="space-y-2">
              <Label class="text-sm font-semibold text-gray-900 dark:text-white">Last Frame</Label>
              <input
                type="file"
                accept="image/*"
                class="block w-full cursor-pointer rounded-xl border border-dashed border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:border-secondary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                onchange={(event) => handleFrameChange(event, 'Last frame', 'last')}
              />
              {#if lastFrame}
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Selected: {lastFrame.file?.name}
                </p>
              {/if}
            </div>
          </div>
        {/if}

        {#if selectedMode === 'video'}
              <CreditEstimateWidget bind:duration />
        {/if}

      </div>
    </div>

    <aside class="space-y-4">


      <div class="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
        <div class="space-y-2">
          <p class="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">Summary</p>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            {selectedMode === 'text' ? 'Text Exist' : selectedMode === 'image' ? 'Image Exist' : 'Video Exist'}
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Prompt first, then length and model. Video generation also supports first and last frame guidance.
          </p>
        </div>

        <div class="mt-5 space-y-3 text-sm">
          <div class="flex items-center justify-between gap-4 rounded-2xl bg-gray-50 px-4 py-3 dark:bg-gray-800">
            <span class="text-gray-500 dark:text-gray-400">Mode</span>
            <span class="font-semibold text-gray-900 dark:text-white capitalize">{selectedMode}</span>
          </div>
          <div class="flex items-center justify-between gap-4 rounded-2xl bg-gray-50 px-4 py-3 dark:bg-gray-800">
            <span class="text-gray-500 dark:text-gray-400">Length</span>
            <span class="font-semibold text-gray-900 dark:text-white capitalize">{selectedLength}</span>
          </div>
          <div class="flex items-center justify-between gap-4 rounded-2xl bg-gray-50 px-4 py-3 dark:bg-gray-800">
            <span class="text-gray-500 dark:text-gray-400">Model</span>
            <span class="font-semibold text-gray-900 dark:text-white">
              {selectedModel === 'gpt-4.1' ? 'GPT-4.1'
                : selectedModel === 'gpt-4o' ? 'GPT-4o'
                : selectedModel === 'claude-3.7-sonnet' ? 'Claude 3.7 Sonnet'
                : selectedModel === 'gemini-2.5-pro' ? 'Gemini 2.5 Pro'
                : selectedModel === 'grok-3' ? 'Grok'
                : selectedModel === 'seedance' ? 'Seedance'
                : selectedModel === 'kling-2.1' ? 'Kling 2.1'
                : 'Kling 2.2'}
            </span>
          </div>
        </div>

        <div class="mt-6">
          <AppButton
            size="xl"
            variant="primary"
            class="w-full py-4 text-base sm:text-lg"
            disabled={!isValidPrompt || !hasEnoughCredits}
            onclick={startGeneration}
          >
            {#if !hasEnoughCredits}
              Need More Credits
            {:else if !isValidPrompt}
              Describe Your Idea First
            {:else}
              Generate with GPTexist
            {/if}
            {#if isValidPrompt && hasEnoughCredits}
              <ArrowRightOutline class="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            {/if}
          </AppButton>
        </div>

      </div>
    </aside>
  </section>
</div>
