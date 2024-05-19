<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import Input from "$lib/components/ui/input/input.svelte";
  import Search from "lucide-svelte/icons/search";
  import InboxItem from "./InboxItem.svelte";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
  import type { InboxStageData } from "./inboxTypes";

  export let onSelectStage: (stage: any) => void;
  export let stages: InboxStageData[] = [];
  export let isShown;

  let selectedStageIndex: number = 0;
  let searchTerm: string = "";
  let filteredStages: InboxStageData[] = [];
  let skipThese: string[] = [
    "handlerId",
    "prevHandlerId",
    "inboxType",
    "final",
    "finished",
    "currentStageTypeIndex",
    "inboxStageTypeIndex",
  ];

  $: {
    filteredStages = stages.filter((stage: InboxStageData) => {
      for (const key in stage) {
        if (skipThese.includes(key as string)) continue;
        const stageKey = key as keyof InboxStageData;
        if (
          String(stage[stageKey])
            .toLowerCase()
            .includes(searchTerm.trim().toLowerCase())
        ) {
          return stage;
        }
      }
      return null;
    });
  }

  if (isShown && filteredStages.length > 0) select(0);

  function select(stageIndex: number) {
    selectedStageIndex = stageIndex;
    onSelectStage(stages[selectedStageIndex]);
  }

  export function getUpdatedSelection() {
    if (stages.length == 0) {
      selectedStageIndex = 0;
      return null;
    } else if (selectedStageIndex >= stages.length) {
      selectedStageIndex = 0;
      return stages[0];
    } else {
      return stages[selectedStageIndex];
    }
  }
</script>

<Card.Root
  data-x-chunk-name="dashboard-05-chunk-3"
  data-x-chunk-description="A table of recent orders showing the following columns: Customer, Type, Status, Date, and Amount."
>
  <Card.Header class="px-7">
    <Card.Title>Inbox</Card.Title>
    <Card.Description>Recent stages that need completion</Card.Description>
    <div class="flex flex-row items-center space-x-4 space-y-0 align-middle">
      <div class="relative w-full">
        <Search
          class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
        />
        <Input
          type="search"
          placeholder="Search..."
          class="w-full rounded-lg bg-background pl-8"
          bind:value={searchTerm}
        />
      </div>
    </div>
  </Card.Header>
  <Card.Content>
    <ScrollArea class="h-96">
      <div class="flex w-[98%] flex-col gap-1">
        {#each filteredStages as stage, index}
          <InboxItem
            {stage}
            isSelected={selectedStageIndex == index}
            onClick={() => select(index)}
          />
        {/each}
      </div>
    </ScrollArea>
  </Card.Content>
</Card.Root>
