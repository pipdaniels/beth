# Beth - AI Video Generator 🎬

Beth is a modern, responsive text-to-video application built with SvelteKit and Flowbite. It features a sleek mobile-first design, dark mode compatibility, and mockups of an agentic code generation streaming console.

## Technology Stack

- **Framework**: SvelteKit 5 (TypeScript / Web Components)
- **Styling**: TailwindCSS v4 + Flowbite Svelte
- **Animations**: `svelte/motion`, native CSS + Svelte transitions.
- **Deployment**: `@sveltejs/adapter-cloudflare` setup for Cloudflare Pages

## Core Architecture

- `$lib/components`: Centralized UI widgets (`MasonryGallery`, `AgentConsole`, etc.)
- `$lib/stores`:
  - `billing.ts`: Real-time mapped balance using `spring` physics.
  - `generation.ts`: Generation progress trackers utilizing `tweened` smooth interpolation.
- **Routes**:
  - `/`: Prompt & estimating.
  - `/generate`: Agent timeline simulating SSE logs.
  - `/gallery`: Rendered video columns.
  - `/billing`: Payments dashboard mockup.

## Getting Started

1. Ensure Node.js 24+ is installed.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```

## Design Language

- Custom brand colors defined via CSS custom properties.
- Strictly adheres to Tailwind utilities avoiding sprawling component `<style>` blocks.
- Real-time terminal mimics "Terminal-Timeline Hybrid", providing user assurance that the Google ADK and Veo 3.0 models are working.
