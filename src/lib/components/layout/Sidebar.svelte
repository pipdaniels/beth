<script lang="ts">
  import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper, Tooltip } from 'flowbite-svelte';
  import { EditOutline, GridOutline, CreditCardOutline, PaperPlaneOutline, ChevronLeftOutline, ChevronRightOutline, CogOutline, UserOutline } from 'flowbite-svelte-icons';
  import { page } from '$app/stores';
  import { sidebarCollapsed } from '$lib/stores/ui';

  const primaryItems = [
    { label: 'Prompt', href: '/', icon: EditOutline, id: 'prompt-tooltip' },
    { label: 'Gallery', href: '/gallery', icon: GridOutline, id: 'gallery-tooltip' },
    { label: 'Publish', href: '/publish', icon: PaperPlaneOutline, id: 'publish-tooltip' },
    { label: 'Billing', href: '/billing', icon: CreditCardOutline, id: 'billing-tooltip' }
  ];

  const secondaryItems = [
    { label: 'Settings', href: '/settings', icon: CogOutline },
    { label: 'Profile', href: '/profile', icon: UserOutline }
  ];
</script>

<Sidebar position="static" class="hidden md:block transition-all duration-300 flex-shrink-0 h-full border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 {$sidebarCollapsed ? '!w-20' : '!w-64'}">
  <SidebarWrapper class="h-full flex flex-col py-4 px-3 gap-4">
    <!-- Header with Logo and Collapse Button -->
    <div class="flex items-center {$sidebarCollapsed ? 'justify-center' : 'justify-between'} mb-2">
      {#if !$sidebarCollapsed}
        <h2 class="text-xl font-bold text-primary">Menu</h2>
      {/if}
      <button 
        onclick={() => sidebarCollapsed.update(c => !c)}
        class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors flex items-center justify-center cursor-pointer"
        title={$sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {#if $sidebarCollapsed}
          <ChevronRightOutline class="w-6 h-6" />
        {:else}
          <ChevronLeftOutline class="w-6 h-6" />
        {/if}
      </button>
    </div>

    <!-- Main Navigation -->
    <div class="flex-1">
      <SidebarGroup class="space-y-2">
        {#each primaryItems as item}
          <SidebarItem
            id={item.id}
            label={$sidebarCollapsed ? '' : item.label}
            href={item.href}
            active={$page.url.pathname === item.href}
            title={item.label}
            aria-label={item.label}
            class={$sidebarCollapsed ? 'flex justify-center' : ''}
            spanClass={$sidebarCollapsed ? 'hidden' : 'ms-3'}
            aClass={$sidebarCollapsed ? 'justify-center' : ''}
          >
            {#snippet icon()}
              {@const Icon = item.icon}
              <Icon class="w-6 h-6 shrink-0 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
            {/snippet}
          </SidebarItem>
          {#if $sidebarCollapsed}
            <Tooltip triggeredBy={`#${item.id}`} placement="right" class="rounded bg-gray-900 px-2 py-1 text-sm font-medium text-white dark:bg-white dark:text-gray-900">
              {item.label}
            </Tooltip>
          {/if}
        {/each}
      </SidebarGroup>
    </div>
    
    <!-- Bottom Navigation (Settings & Profile) -->
    <div class="border-t border-gray-200 dark:border-gray-800 pt-4">
      <SidebarGroup class="space-y-2">
        {#each secondaryItems as item}
          <SidebarItem
            label={$sidebarCollapsed ? '' : item.label}
            href={item.href}
            active={$page.url.pathname === item.href}
            title={item.label}
            aria-label={item.label}
            class={$sidebarCollapsed ? 'flex justify-center' : ''}
            spanClass={$sidebarCollapsed ? 'hidden' : 'ms-3'}
            aClass={$sidebarCollapsed ? 'justify-center' : ''}
          >
            {#snippet icon()}
              {@const Icon = item.icon}
              <Icon class="w-6 h-6 shrink-0 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
            {/snippet}
          </SidebarItem>
        {/each}
      </SidebarGroup>
    </div>
  </SidebarWrapper>
</Sidebar>
