<script lang="ts">
  import * as Tooltip from "$lib/components/ui/tooltip/index.js";
  import type { ComponentType } from "svelte";

  import { page } from "$app/stores";
  import clsx from "clsx";

  export let icon: ComponentType;
  export let name: string;
  export let href: string;

  $: isSelected = $page.route.id?.includes(href);
</script>

<Tooltip.Root>
  <Tooltip.Trigger asChild let:builder>
    <a
      {href}
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
        <span>{name}</span>
      </div>
    </a>
  </Tooltip.Trigger>
  <Tooltip.Content side="right">{name}</Tooltip.Content>
</Tooltip.Root>
