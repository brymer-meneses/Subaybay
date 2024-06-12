<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import type { InboxNotificationData } from "$lib/notifications";

  import clsx from "clsx";

  export let isSelected: boolean;
  export let data: InboxNotificationData;
</script>

<Button
  class={clsx("flex h-min w-full justify-start rounded-lg p-4")}
  variant={isSelected ? "secondary" : "outline"}
>
  Sent you a notification
</Button>
