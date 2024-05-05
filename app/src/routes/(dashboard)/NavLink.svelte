<script lang="ts">
  import * as Tooltip from "$lib/components/ui/tooltip/index.js";
  import type { ComponentType } from "svelte";

  import { page } from "$app/stores";
  import clsx from "clsx";

  export let icon: ComponentType;
  export let name: string;
  export let href: string;
  export let notifications: number = 0;

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
    <div class="flex items-center gap-3">
      <div class="relative h-5 w-5">
        <svelte:component this={icon} class="h-5 w-5" />
        {#if notifications !== 0}
          <div
            class="absolute right-[-10px] top-[-10px] flex w-[15px] items-center justify-center rounded-full bg-red-500 p-[3px] text-xs text-white drop-shadow-sm"
          >
            {notifications}
          </div>
        {/if}
      </div>
      <span class="text-sm">{name}</span>
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
          <div class="relative h-5 w-5">
            <svelte:component this={icon} class="h-5 w-5" />
            {#if notifications !== 0}
              <div
                class="absolute right-[-10px] top-[-10px] flex w-[15px] items-center justify-center rounded-full bg-red-500 p-[2px] text-xs text-white drop-shadow-sm"
              >
                {notifications}
              </div>
            {/if}
          </div>
        </div>
      </a>
    </Tooltip.Trigger>
    <Tooltip.Content side="right">{name}</Tooltip.Content>
  </Tooltip.Root>
{/if}
