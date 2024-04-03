<script lang="ts">
  import clsx from "clsx";
  import { page } from "$app/stores";

  export let href: string;

  $: isSelected = $page.route.id == href;
</script>

<a
  {href}
  class={clsx(
    "flex flex-row gap-x-3 w-4/5  p-2 rounded-r-lg",
    isSelected ? "bg-primary text-white drop-shadow-lg" : "hover:bg-pale-red-100 font-light",
  )}
>
  <div class="w-full flex gap-2 px-5 items-center">
    <slot />
  </div>
</a>
