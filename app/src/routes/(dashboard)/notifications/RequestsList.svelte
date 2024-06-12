<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
  import RequestItem from "./MessageItem.svelte";
  import type { InboxNotificationData } from "./types";

  export let data: InboxNotificationData[];
</script>

<Card.Root class="h-[80vh] w-full">
  <Card.Content class="h-full p-4">
    <ScrollArea class="h-full">
      <div class="flex w-[99%] flex-col gap-1">
        {#each data as requestData}
          <RequestItem isSelected={false} data={requestData} />
        {/each}
      </div>
    </ScrollArea>
  </Card.Content>
</Card.Root>
