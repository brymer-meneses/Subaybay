<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import InboxItem from "./InboxItem.svelte";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";

  export let type: "pending" | "active";
</script>

<Card.Root
  data-x-chunk-name="dashboard-05-chunk-3"
  data-x-chunk-description="A table of recent orders showing the following columns: Customer, Type, Status, Date, and Amount."
>
  <Card.Header class="px-7">
    <Card.Title>Inbox</Card.Title>
    <Card.Description>Recent stages that need completion</Card.Description>
  </Card.Header>
  <Card.Content>
    <ScrollArea class="h-96">
      <div class="flex w-[98%] flex-col gap-1">
        {#each Array(100) as _, index (index)}
          <InboxItem
            isSelected={false}
            stageTitle="HD and GMC forwarded to UR for signature"
            requestTitle="Honorable Dismissal"
            dateSent={new Date().toDateString()}
            requestId={1}
          />
        {/each}
      </div>
    </ScrollArea>
  </Card.Content>
</Card.Root>