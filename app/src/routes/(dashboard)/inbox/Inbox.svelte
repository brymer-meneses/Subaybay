<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import Input from "$lib/components/ui/input/input.svelte";
  import Search from "lucide-svelte/icons/search";
  import InboxItem from "./InboxItem.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
  import type { InboxStageData, MultiStageData } from "./inboxTypes";
  import ChevronDown from "lucide-svelte/icons/chevron-down";

  export let onSelectStage: (stage: MultiStageData) => void;

  // these are the stages ungrouped
  export let stages: InboxStageData[] = [];
  export let type: "active" | "pending";
  export let isShown: boolean;

  let selectedStageIndex: number = 0;
  let searchTerm: string = "";
  let multiStages: MultiStageData[] = [];
  let filtered: MultiStageData[] = multiStages;
  let lookAtTheseOnly: string[] = [
    "inboxStageTitle",
    "requestTitle",
    "stageTitle",
    "studentName",
    "studentNumber",
  ];

  let sortBy: string = "Newest";

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
        if (!lookAtTheseOnly.includes(key as string)) continue;
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
    if (isShown && filtered.length > 0) {
      select(0);
    }
  }

  $: {
    if (sortBy === "Newest") filtered = filtered.sort(sortInboxNewest);
    else if (sortBy === "Oldest") filtered = filtered.sort(sortInboxOldest);
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

  const sortInbox = (a: MultiStageData, b: MultiStageData) => {
    let dateA = a.mainStage.dateSent.getTime();
    let dateB = b.mainStage.dateSent.getTime();
    return { dateA, dateB };
  };

  const sortInboxNewest = (a: MultiStageData, b: MultiStageData) => {
    const { dateA, dateB } = sortInbox(a, b);
    return dateB - dateA;
  };

  const sortInboxOldest = (a: MultiStageData, b: MultiStageData) => {
    const { dateA, dateB } = sortInbox(a, b);
    return dateA - dateB;
  };
</script>

<Card.Root class="flex w-full flex-grow flex-col border">
  <Card.Header class="px-7">
    <div class="flex flex-row justify-between">
      <div>
        <Card.Title>Inbox</Card.Title>
        <Card.Description>Recent stages that need completion</Card.Description>
      </div>
      <div>
        <span class="text-muted-foreground mr-2 text-sm">Sort:</span>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Button variant="outline" class="pr-0"
              >{sortBy} <ChevronDown class="mx-2" /></Button
            >
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Label>Sort By</DropdownMenu.Label>
            <DropdownMenu.Separator />
            <DropdownMenu.RadioGroup bind:value={sortBy}>
              <DropdownMenu.RadioItem value={"Newest"}
                >Newest</DropdownMenu.RadioItem
              >
              <DropdownMenu.RadioItem value={"Oldest"}
                >Oldest</DropdownMenu.RadioItem
              >
            </DropdownMenu.RadioGroup>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </div>
    <div class="flex flex-row items-center space-x-4 space-y-0 align-middle">
      <div class="relative w-full">
        <Search
          class="text-muted-foreground absolute left-2.5 top-2.5 h-4 w-4"
        />
        <Input
          type="search"
          placeholder="Search..."
          class="bg-background w-full rounded-lg pl-8"
          bind:value={searchTerm}
        />
      </div>
    </div>
  </Card.Header>
  <Card.Content class="flex flex-grow overflow-hidden">
    <div class="h-[60vh] w-full grow xl:h-full">
      <ScrollArea class="flex h-full w-full flex-col transition-all">
        {#each filtered as multiStage, index}
          <div class="mb-2 w-full">
            <InboxItem
              stage={multiStage.mainStage}
              isSelected={selectedStageIndex == index}
              onClick={() => select(index)}
            />
          </div>
        {/each}
      </ScrollArea>
    </div>
  </Card.Content>
</Card.Root>
