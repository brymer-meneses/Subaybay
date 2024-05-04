<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import InboxItem from "./InboxItem.svelte";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";

  export let onSelectStage: (stage: any) => void;
  export let type: "pending" | "active";
  export let stages: any[] = [];
  let selectedStageIndex: number = 0;

  if(stages.length > 0)
    select(0);

  function select(stageIndex: number) {
    selectedStageIndex = stageIndex;
    onSelectStage(stages[selectedStageIndex]);
  }
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
        {#each stages as stage, index}
          <InboxItem
            isSelected={selectedStageIndex == index}
            stageTitle={stage.stageTitle}
            requestTitle={stage.requestTitle}
            dateSent={stage.dateSent}
            requestId={stage.requestId}
            onClick={() => select(index)}
          />
        {/each}
      </div>
    </ScrollArea>
  </Card.Content>
</Card.Root>
