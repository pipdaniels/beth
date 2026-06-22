import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

// export default defineConfig({
//     optimizeDeps: {
//         include: ['flowbite-svelte']
//     },
//     plugins: [tailwindcss(), sveltekit()]
// });

export default defineConfig({
    plugins: [
        tailwindcss(), 
        sveltekit()
    ],
    optimizeDeps: {
        // Exclude from pre-bundling so the Svelte plugin can 
        // transform it properly during the dev/build phase
        exclude: ['flowbite-svelte'] 
    },
    ssr: {
        // Ensure SSR also treats this as a source file to be transformed
        noExternal: ['flowbite-svelte']
    }
});