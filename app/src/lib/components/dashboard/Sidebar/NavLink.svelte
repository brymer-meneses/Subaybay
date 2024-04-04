<script lang="ts">
  import clsx from "clsx";
  import { page } from "$app/stores";
  import { afterUpdate } from "svelte";

  export let href: string;
  export let name: string;
  export let icon: any;

  $: isSelected = $page.route.id == href;

  afterUpdate(() => {
    console.log(width);
  });

  let width: number;

  $: isBig = width >= 150;
</script>

<div bind:clientWidth={width} class={clsx("w-full", !isBig && "px-2")}>
  <a
    {href}
    class={clsx(
      "flex p-2 items-center",
      isBig ? "w-11/12 rounded-r-lg" : "w-full rounded-xl p-2",
      isSelected
        ? "bg-primary text-white drop-shadow-lg"
        : "hover:bg-pale-red-100 font-light",
    )}
  >
    <div
      class={clsx(
        "w-full flex items-center gap-4",
        isBig ? "px-4 justify-start" : "justify-center",
      )}
    >
      <svelte:component this={icon} size={24} />

      {#if isBig}
        <p class="text-sm">{name}</p>
      {/if}
    </div>
  </a>
</div>
