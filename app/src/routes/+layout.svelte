<script lang="ts">
  import "../app.pcss";

  import "@fontsource-variable/inter";
  import "@fontsource/poppins";

  import { page } from "$app/stores";
  import { getFlash } from "sveltekit-flash-message";

  import { toast } from "svelte-sonner";
  import { Toaster } from "$lib/components/ui/sonner";
  import { onMount } from "svelte";

  const flash = getFlash(page);

  onMount(() => {
    if ($flash) {
      switch ($flash.type) {
        case "error":
          toast.error($flash.message, $flash.args);
          break;
        case "success":
          toast.success($flash.message, $flash.args);
          break;
      }
    }
  });

  $: {
    if ($flash) {
      switch ($flash.type) {
        case "error":
          toast.error($flash.message, $flash.args);
          break;
        case "success":
          toast.success($flash.message, $flash.args);
          break;
      }
    }
  }
</script>

<Toaster position="top-right" closeButton />
<slot />
