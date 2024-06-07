<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import Input from "$lib/components/ui/input/input.svelte";
  import Search from "lucide-svelte/icons/search";
  import InboxItem from "./InboxItem.svelte";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
  import type { InboxStageData, MultiStageData } from "./inboxTypes";

  export let onSelectStage: (stage: MultiStageData) => void;

  // these are the stages ungrouped
  export let stages: InboxStageData[] = [];
  export let type: "active" | "pending";
  export let isShown: boolean;

  let selectedStageIndex: number = 0;
  let searchTerm: string = "";
  let multiStages: MultiStageData[] = [];
  let filtered: MultiStageData[] = multiStages;
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
    if (type === "active") {
      multiStages = stages.map<MultiStageData>((stage: InboxStageData) => {
        return {
          mainStage: stage,
          otherStages: [],
        };
      });
    } else {
      // group stages according to request type
      //
      let grouper: { [key: string]: MultiStageData } = {};
      for (const stage of stages) {
        if (stage.requestId in grouper) {
          // use the most recent stage as the main stage
          if (
            grouper[stage.requestId].mainStage.inboxStageTypeIndex <
            stage.inboxStageTypeIndex
          ) {
            grouper[stage.requestId].otherStages.push(
              grouper[stage.requestId].mainStage,
            );
            grouper[stage.requestId].mainStage = stage;
          } else {
            grouper[stage.requestId].otherStages.push(stage);
          }
        } else {
          grouper[stage.requestId] = {
            mainStage: stage,
            otherStages: [],
          };
        }
      }

      multiStages = Object.keys(grouper).map<MultiStageData>((key: string) => {
        // sort other stages for organization purposes
        grouper[key].otherStages.sort((a, b) => {
          return a.inboxStageTypeIndex - b.inboxStageTypeIndex;
        });
        return grouper[key];
      });
    }
  }

  $: {
    filtered = multiStages.filter((multiStage: MultiStageData) => {
      const stage = multiStage.mainStage;
      for (const key in stage) {
        if (skipThese.includes(key as string)) continue;
        const stageKey = key as keyof InboxStageData;
        if (
          String(stage[stageKey])
            .toLowerCase()
            .includes(searchTerm.trim().toLowerCase())
        ) {
          return true;
        }
      }
      return false;
    });
  }

  $: {
    if (isShown && filtered.length > 0) select(0);
  }

  function select(stageIndex: number) {
    selectedStageIndex = stageIndex;
    onSelectStage(filtered[selectedStageIndex]);
  }

  export function getUpdatedSelection() {
    if (stages.length == 0) {
      selectedStageIndex = 0;
      return null;
    } else if (selectedStageIndex >= stages.length) {
      selectedStageIndex = 0;
      return filtered[0];
    } else {
      return filtered[selectedStageIndex];
    }
  }
</script>

<Card.Root>
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
    <ScrollArea
      class="flex h-[35rem] w-[98%] flex-grow flex-col sm:max-xl:h-96 lg:max-xl:w-full"
    >
      <div class="flex flex-col gap-2 transition-all">
        {#each filtered as multiStage, index}
          <InboxItem
            stage={multiStage.mainStage}
            isSelected={selectedStageIndex == index}
            onClick={() => select(index)}
          />
        {/each}
      </div>
    </ScrollArea>
  </Card.Content>
</Card.Root>
