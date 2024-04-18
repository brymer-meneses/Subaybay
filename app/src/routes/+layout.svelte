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
    if (!$flash) {
      return;
    }

    switch ($flash.type) {
      case "error":
        toast.error($flash.message);
        break;
      case "success":
        toast.success($flash.success);
        break;
    }
  });
</script>

<Toaster position="top-right" closeButton />
<slot />
