<script lang="ts">
  import { goto } from "$app/navigation";

  export let href: string;
</script>

<a
  {href}
  class="flex flex-row gap-x-3 w-4/5 hover:bg-primary hover:text-white p-2 rounded-r-lg"
>
  <div class="w-full flex gap-2 px-5 items-center">
    <slot />
  </div>
</a>
