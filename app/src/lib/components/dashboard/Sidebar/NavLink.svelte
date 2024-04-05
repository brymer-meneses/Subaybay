<script lang="ts">
  import clsx from "clsx";
  import { page } from "$app/stores";

  export let href: string;
  export let name: string;
  export let icon: any;

  $: isSelected = $page.route.id == href;

  export let isExpanded: boolean;
</script>

<div class={clsx("w-full", !isExpanded && "px-2")}>
  <a
    {href}
    class={clsx(
      "flex p-2 items-center",
      isExpanded ? "w-11/12 rounded-r-lg" : "w-full rounded-xl p-2",
      isSelected
        ? "bg-primary text-white drop-shadow-lg"
        : "hover:bg-pale-red-100 font-light",
    )}
  >
    <div
      class={clsx(
        "w-full flex items-center gap-4",
        isExpanded ? "px-4 justify-start" : "justify-center",
      )}
    >
      <svelte:component this={icon} size={24} />

      {#if isExpanded}
        <p class="text-sm">{name}</p>
      {/if}
    </div>
  </a>
</div>
