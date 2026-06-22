<script lang="ts">
  import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';
  import { EditOutline, GridOutline, CreditCardOutline, PaperPlaneOutline, ChevronLeftOutline, ChevronRightOutline } from 'flowbite-svelte-icons';
  import { page } from '$app/stores';
  import { sidebarCollapsed } from '$lib/stores/ui';
</script>

<Sidebar class="hidden md:block transition-all duration-300 flex-shrink-0 h-full border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 {$sidebarCollapsed ? '!w-20' : '!w-64'}">
  <SidebarWrapper class="h-full flex flex-col justify-between py-4 px-3">
    <div class="flex-1">
      <SidebarGroup class="space-y-2">
        <SidebarItem label={$sidebarCollapsed ? '' : 'Prompt'} href="/" active={$page.url.pathname === '/'} title="Prompt">
          <svelte:fragment slot="icon">
            <EditOutline class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
          </svelte:fragment>
        </SidebarItem>
        
        <SidebarItem label={$sidebarCollapsed ? '' : 'Gallery'} href="/gallery" active={$page.url.pathname === '/gallery'} title="Gallery">
          <svelte:fragment slot="icon">
            <GridOutline class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
          </svelte:fragment>
        </SidebarItem>

        <SidebarItem label={$sidebarCollapsed ? '' : 'Publish'} href="/publish" active={$page.url.pathname === '/publish'} title="Publish">
          <svelte:fragment slot="icon">
            <PaperPlaneOutline class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
          </svelte:fragment>
        </SidebarItem>

        <SidebarItem label={$sidebarCollapsed ? '' : 'Billing'} href="/billing" active={$page.url.pathname === '/billing'} title="Billing">
          <svelte:fragment slot="icon">
            <CreditCardOutline class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
          </svelte:fragment>
        </SidebarItem>
      </SidebarGroup>
    </div>
    
    <div class="mt-auto border-t border-gray-250 dark:border-gray-800 pt-4 flex {$sidebarCollapsed ? 'justify-center' : 'justify-end'}">
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
  </SidebarWrapper>
</Sidebar>

