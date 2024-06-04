<script lang="ts">
  import * as Tooltip from "$lib/components/ui/tooltip/index.js";
  import type { ComponentType } from "svelte";

  import { page } from "$app/stores";
  import clsx from "clsx";

  export let icon: ComponentType;
  export let name: string;
  export let href: string;
  export let target: string = "";

  export let isCollapsed: boolean;

  $: isSelected = $page.route.id?.includes(href);
</script>

{#if !isCollapsed}
  <a
    {href}
    {target}
    class={clsx(
      "hover:text-foreground flex h-10 items-center rounded-xl px-4",
      isSelected
        ? "text-accent-foreground bg-slate-200"
        : "text-muted-foreground",
    )}
  >
    <div class="flex items-center gap-3">
      <svelte:component this={icon} class="h-5 w-5" />
      <span class="text-base">{name}</span>
    </div>
  </a>
{:else}
  <Tooltip.Root>
    <Tooltip.Trigger asChild let:builder>
      <a
        {href}
        {target}
        class={clsx(
          "hover:text-foreground flex h-10 items-center rounded-xl px-4",
          isSelected
            ? "text-accent-foreground bg-slate-200"
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
