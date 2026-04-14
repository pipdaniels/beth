<script lang="ts">
  import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';
  import { EditOutline, GridOutline, CreditCardOutline } from 'flowbite-svelte-icons';
  import { page } from '$app/stores';
</script>

<Sidebar class="hidden md:block w-64 flex-shrink-0 h-full border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
  <SidebarWrapper>
    <SidebarGroup>
      <SidebarItem label="Prompt" href="/" active={$page.url.pathname === '/'} >
        <svelte:fragment slot="icon">
          <EditOutline class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
        </svelte:fragment>
      </SidebarItem>
      <SidebarItem label="Gallery" href="/gallery" active={$page.url.pathname === '/gallery'} >
        <svelte:fragment slot="icon">
          <GridOutline class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
        </svelte:fragment>
      </SidebarItem>
      <SidebarItem label="Billing" href="/billing" active={$page.url.pathname === '/billing'} >
        <svelte:fragment slot="icon">
          <CreditCardOutline class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
        </svelte:fragment>
      </SidebarItem>
    </SidebarGroup>
  </SidebarWrapper>
</Sidebar>
