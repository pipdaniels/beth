<script lang="ts">
  import Navbar from '$lib/components/layout/Navbar.svelte';
  import Sidebar from '$lib/components/layout/Sidebar.svelte';
  import BottomNav from '$lib/components/layout/BottomNav.svelte';

  let { children } = $props();
</script>

<div class="flex flex-col h-full w-full animate-fade-in">
  <Navbar />
  <div class="flex flex-1 overflow-hidden">
    <Sidebar />
    <main class="flex-1 overflow-y-auto p-4 md:p-8 pb-32 md:pb-8 w-full max-w-full">
      {@render children()}
    </main>
  </div>
  <BottomNav />
</div>
