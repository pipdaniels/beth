<script lang="ts">
  let { 
    variant = 'primary',
    class: cssClass = '', 
    children, 
    ...rest 
  } = $props();

  const baseStyles = 'font-bold tracking-wide transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] shadow-sm hover:shadow-xl rounded-xl flex items-center justify-center gap-2 px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none';
  
  const variants: Record<string, string> = {
    primary: 'bg-gradient-to-br from-primary-900 to-primary text-white focus:ring-4 focus:ring-primary/20 dark:from-white dark:to-gray-100 dark:text-primary dark:focus:ring-white/10 hover:brightness-110',
    secondary: 'bg-gradient-to-br from-secondary to-blue-600 text-white focus:ring-4 focus:ring-secondary/20 dark:from-secondary dark:to-blue-500 dark:focus:ring-secondary/10 hover:brightness-110',
    outline: 'bg-white dark:bg-transparent border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-secondary dark:hover:border-secondary focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-800'
  };
</script>

{#if rest.href}
  <a 
    {...rest} 
    class="{baseStyles} {variants[variant]} {cssClass}"
  >
    {@render children?.()}
  </a>
{:else}
  <button 
    {...rest} 
    class="{baseStyles} {variants[variant]} {cssClass}"
  >
    {@render children?.()}
  </button>
{/if}
