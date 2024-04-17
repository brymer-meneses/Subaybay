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
        "flex h-9 w-9 items-center justify-center rounded-lg  transition-colors hover:text-foreground md:h-8 md:w-8",
        isSelected
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground",
      )}
      use:builder.action
      {...builder}
    >
      <svelte:component this={icon} class="h-5 w-5" />
      <span class="sr-only">{name}</span>
    </a>
  </Tooltip.Trigger>
  <Tooltip.Content side="right">{name}</Tooltip.Content>
</Tooltip.Root>
