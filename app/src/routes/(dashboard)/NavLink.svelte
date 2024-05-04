<script lang="ts">
  import * as Tooltip from "$lib/components/ui/tooltip/index.js";
  import type { ComponentType } from "svelte";

  import { page } from "$app/stores";
  import clsx from "clsx";

  export let icon: ComponentType;
  export let name: string;
  export let href: string;

  export let isCollapsed: boolean;

  $: isSelected = $page.route.id?.includes(href);
</script>

{#if !isCollapsed}
  <a
    {href}
    class={clsx(
      "flex h-10 items-center rounded-xl px-4 hover:text-foreground",
      isSelected
        ? "bg-slate-200 text-accent-foreground"
        : "text-muted-foreground",
    )}
  >
    <div class="flex items-center gap-4">
      <svelte:component this={icon} class="h-5 w-5" />
      <span>{name}</span>
    </div>
  </a>
{:else}
  <Tooltip.Root>
    <Tooltip.Trigger asChild let:builder>
      <a
        {href}
        class={clsx(
          "flex h-10 items-center rounded-xl px-4 hover:text-foreground",
          isSelected
            ? "bg-slate-200 text-accent-foreground"
            : "text-muted-foreground",
        )}
        use:builder.action
        {...builder}
      >
        <div class="flex items-center gap-4">
          <svelte:component this={icon} class="h-5 w-5" />
        </div>
      </a>
    </Tooltip.Trigger>
    <Tooltip.Content side="right">{name}</Tooltip.Content>
  </Tooltip.Root>
{/if}
