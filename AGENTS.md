# Beth - AI Coding Agent Guide

**Beth** is a modern text-to-video web application built with **SvelteKit 5**, **TypeScript**, **TailwindCSS**, and **Flowbite Svelte**. This guide helps AI agents understand the codebase architecture, conventions, and best practices.

## Quick Start

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:5173)
npm run check:watch  # Live TypeScript checking
npm run format       # Auto-format code (Prettier + TailwindCSS)
npm run lint         # Check linting (ESLint + Prettier)
npm run build        # Build for Cloudflare Pages
```

## Architecture Overview

### Route Structure

- **`(app)/*`** — Protected routes (requires authentication)
  - `/` — Prompt & credit estimation
  - `/generate` — Video generation with progress timeline
  - `/gallery` — Rendered video gallery (masonry layout)
  - `/billing` — Payment dashboard mockup
- **`(auth)/*`** — Public authentication routes
  - `/login` — Login form
  - `/signup` — Account creation
  - `/forgot-password`, `/reset-password` — Password recovery
  - `/verify-email` — Email verification
  - `/login/otp` — OTP verification

**Auth Flow:** Root `+layout.svelte` enforces auth via `$effect` → redirects to `/login` if not authenticated.

### State Management (Stores)

All application state lives in **`$lib/stores/`**:

| Store           | Purpose                                      | Reactivity                                 |
| --------------- | -------------------------------------------- | ------------------------------------------ |
| `auth.ts`       | User authentication state (`User \| null`)   | `writable`                                 |
| `billing.ts`    | Credit balance with spring physics animation | `writable` + `spring` for bouncy feel      |
| `generation.ts` | Current job status, progress, logs, timeline | `writable` + `derived` for computed states |

**Pattern:** Stores use **Svelte 5 runes** (`writable`, `derived`, `spring`, `tweened`). Never mutate store values directly—use `.set()` or `.update()`.

### Component Architecture

- **Smart components** (pages) — Orchestrate stores, handle logic
- **Presentational components** (`$lib/components/`) — Pure UI, receive props only
- **Layout components** (`$lib/components/layout/`) — Navbar, Sidebar, BottomNav (responsive desktop/mobile)

**Key Components:**

- `AgentConsole.svelte` — Streaming job timeline simulator
- `BillingCard.svelte` — Credit display with spring animation
- `CreditEstimateWidget.svelte` — Dynamic cost estimator
- `MasonryGallery.svelte` — Pinterest-style video grid (CSS `columns`)
- `VideoModal.svelte` — Video player modal

## Development Conventions

### TypeScript

- **Strict mode enabled** (`"strict": true`)
- All types centralized in **`$lib/types/index.ts`**
- Status enums as union types: `'idle' | 'planning' | 'enhancing' | 'generating' | 'stitching' | 'completed' | 'failed'`
- Store types must be explicit: `writable<User | null>`, `derived<JobStatus>`

### Svelte 5 Runes (Required)

- **`$state()`** — Component local state (auto-reactive)
- **`$props()`** — Typed component props with defaults
- **`$derived()`** — Computed values (auto-track dependencies)
- **`$bindable()`** — Two-way binding (export state to parent)
- **`$effect()`** — Side effects (runs on dependency changes)
- **Snippet syntax** — `{#snippet name(args)}...{/snippet}` for composition

**Never use** old Svelte 4 syntax (let, reactive statements, etc.).

### Styling (TailwindCSS v4 Only)

- **No `<style>` blocks** in components — use Tailwind utilities exclusively
- Custom brand colors defined in `@theme`:
  - `primary: #020617` (navy)
  - `secondary: #0EA5E9` (cyan)
- **Dark mode** via `.dark` variant + localStorage toggle
- **Mobile-first approach:**
  - Default styles for mobile
  - `md:` prefix for desktop breakpoints
  - Hide elements: `hidden md:block` (desktop-only), `md:hidden` (mobile-only)
- **Animations:** Custom `@keyframes fade-in` + Svelte transitions (`transition:fade`, `in:fly`)
- **Class sorting:** `prettier --write` auto-sorts TailwindCSS classes

### Naming Conventions

- **Components:** `PascalCase` (e.g., `AgentConsole.svelte`)
- **Routes/folders:** `kebab-case` (e.g., `forgot-password/`)
- **Stores/utilities:** `camelCase` (e.g., `generation.ts`)
- **Types/interfaces:** `PascalCase` (e.g., `User`, `JobStatus`)

## Common Patterns

### Reactive Derived State

```typescript
// ✅ Good: Auto-recomputes when dependencies change
let hasEnoughCredits = $derived($creditBalance >= costEstimate);
let isFormValid = $derived(promptText.length > 0 && !isLoading);
// Use in templates: disabled={!isFormValid}
```

### Store Updates

```typescript
// ✅ Good
jobStatus.set('generating');
jobStatus.update(s => ({ ...s, progress: 50 }));

// ❌ Bad: Direct mutation won't trigger reactivity
$generation.status = 'generating';
```

### Motion & Animation

```typescript
// Spring physics for natural bouncy animations
let balance = spring(0, { stiffness: 0.1, damping: 0.8 });

// Tweened for smooth linear interpolation
let progress = tweened(0, { duration: 800, easing: cubicInOut });

// Transitions on elements
<div transition:fade={{ duration: 200 }}>
  <p in:fly={{ y: 20, duration: 400 }}>Animated text</p>
</div>
```

### Responsive Layout

```html
<!-- Sidebar visible on desktop, hidden on mobile -->
<div class="hidden md:block w-64 bg-slate-900">
  <Sidebar />
</div>

<!-- Mobile-only bottom nav, adjust padding -->
<div class="pb-32 md:pb-8">
  <BottomNav class="md:hidden" />
</div>
```

### Form Handling

```html
<form onsubmit|preventDefault={handleSubmit}>
  <input bind:value={prompt} placeholder="Enter prompt" />
  <button disabled={!isValid || isSubmitting}>
    {isSubmitting ? 'Generating...' : 'Generate'}
  </button>
</form>
```

### Auth Guard (Use in pages)

```typescript
import { goto } from '$app/navigation';
import { auth } from '$lib/stores/auth';

// Redirect if not authenticated (already done in root layout)
// For route-specific logic:
if (!$auth?.id) {
  goto('/login');
}
```

## Important Directories & Files

| Path                  | Purpose                                           |
| --------------------- | ------------------------------------------------- |
| `src/routes/`         | SvelteKit file-based routing                      |
| `src/lib/components/` | Reusable UI components                            |
| `src/lib/stores/`     | Global reactive state (auth, billing, generation) |
| `src/lib/types/`      | Centralized TypeScript definitions                |
| `src/css/app.css`     | Global styles + TailwindCSS directives            |
| `svelte.config.js`    | SvelteKit adapter config (Cloudflare Pages)       |
| `vite.config.ts`      | Vite plugins (TailwindCSS, SvelteKit)             |
| `tsconfig.json`       | Strict TypeScript settings                        |
| `eslint.config.js`    | Linting rules (ESLint + Prettier)                 |

## Potential Pitfalls

### Reactivity

- ❌ Forgetting `$state()` on local variables → no updates
- ❌ Using store.set() inside components without `$effect` → re-runs every render
- ❌ `$effect` without dependencies → infinite loops
- ✅ Always use `.set()` or `.update()` for stores, never direct mutation

### TypeScript

- ❌ Ignoring null checks (`User | null`)
- ❌ Non-exhaustive status handling in conditional logic
- ✅ Enable strict mode, leverage type narrowing

### Styling

- ❌ Adding `<style>` blocks → defeats Tailwind's optimizations
- ❌ Mixing custom CSS with Tailwind utilities → specificity wars
- ❌ Forgetting to run `prettier --write` → class order issues
- ✅ Stick to Tailwind utilities, use `@apply` only when necessary

### Deployment (Cloudflare Pages)

- ❌ Using Node.js APIs in routes (no fs, path, etc.)
- ❌ Storing client-only code without `import { browser }` guard
- ✅ Check `if (browser)` before accessing localStorage, document, etc.

### Component Development

- ❌ Creating stores for component-local state → harder to test, unnecessary overhead
- ❌ Forgetting `$bindable()` when child should update parent
- ❌ Icon size inconsistency (mix of `w-4 h-4`, `w-5 h-5`, `w-6 h-6`)
- ✅ Use `$state()` for local, stores for shared; use `$bindable()` for child → parent updates

## Code Quality

### Pre-commit Checklist

1. Run `npm run format` to auto-format
2. Run `npm run lint` to catch issues
3. Run `npm run check` for type safety
4. Test responsive layout (resize browser to mobile)
5. Test dark mode toggle (localStorage)

### Testing Patterns

- No built-in test framework configured
- Suggest adding **Vitest** + **Svelte Testing Library** for component testing
- Stores can be tested in isolation (they're just functions)

## Scaling Guidance

When extending Beth:

1. **New Features** → Create routes in `(app)/` + store in `$lib/stores/` if shared state
2. **New Components** → Follow BillingCard/CreditEstimateWidget structure (smart + presentational split)
3. **New Types** → Add to `$lib/types/index.ts`, export from barrel
4. **Backend Integration:**
   - Replace SSE simulation with real `new EventSource()`
   - Use SvelteKit server actions (`+server.ts`) for API calls
   - Replace store mocks with database queries
5. **Performance:**
   - Consider code-splitting for large routes (SvelteKit does this automatically)
   - Monitor bundle size (Flowbite CSS isn't heavily tree-shaken)

## Resources

- [SvelteKit Docs](https://kit.svelte.dev)
- [Svelte 5 Runes Guide](https://svelte.dev/docs/runes)
- [TailwindCSS v4](https://tailwindcss.com)
- [Flowbite Svelte](https://flowbite-svelte.com)
- See [README.md](README.md) for project overview

---

**Last Updated:** April 2026
