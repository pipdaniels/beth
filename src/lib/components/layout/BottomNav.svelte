<script lang="ts">
  import { EditOutline, GridOutline, PaperPlaneOutline, CreditCardOutline } from 'flowbite-svelte-icons';
  import { page } from '$app/stores';
</script>

<div class="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700 md:hidden">
    <div class="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
        <a href="/" class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-900 group {$page.url.pathname === '/' ? 'text-secondary dark:text-secondary' : 'text-gray-500 dark:text-gray-400'}">
            <EditOutline class="w-6 h-6 mb-1" />
            <span class="text-xs">Prompt</span>
        </a>
        <a href="/gallery" class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-900 group {$page.url.pathname === '/gallery' ? 'text-secondary dark:text-secondary' : 'text-gray-500 dark:text-gray-400'}">
            <GridOutline class="w-6 h-6 mb-1" />
            <span class="text-xs">Gallery</span>
        </a>
        <a href="/publish" class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-900 group {$page.url.pathname === '/publish' ? 'text-secondary dark:text-secondary' : 'text-gray-500 dark:text-gray-400'}">
            <PaperPlaneOutline class="w-6 h-6 mb-1" />
            <span class="text-xs">Publish</span>
        </a>
        <a href="/billing" class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-900 group {$page.url.pathname === '/billing' ? 'text-secondary dark:text-secondary' : 'text-gray-500 dark:text-gray-400'}">
            <CreditCardOutline class="w-6 h-6 mb-1" />
            <span class="text-xs">Billing</span>
        </a>
    </div>
</div>

