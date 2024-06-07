<script lang="ts">
  import * as DD from "$lib/components/ui/dropdown-menu";
  import * as Dialog from "$lib/components/ui/dialog";
  import { Label } from "$lib/components/ui/label";
  import { Button } from "$lib/components/ui/button";
  import { MoveLeft } from "lucide-svelte/icons";
  import { enhance } from "$app/forms";
  import type { MultiStageData } from "../inboxTypes";
  import { ChevronDown } from "lucide-svelte/icons";
  import Separator from "$lib/components/ui/separator/separator.svelte";

  export let multiStage: MultiStageData;
  export let enhanceFunc;

  let options: { [key: string]: string } = {};
  let selected: { stageTypeIndex: string; stageTitle: string };
  let selectedIndex = multiStage.mainStage.inboxStageTypeIndex.toString();

  $: selectedIndex = multiStage.mainStage.inboxStageTypeIndex.toString();
  $: stage = multiStage.mainStage;
  $: {
    options = {};
    options[multiStage.mainStage.inboxStageTypeIndex.toString()] =
      multiStage.mainStage.inboxStageTitle;
    for (const stage of multiStage.otherStages) {
      options[stage.inboxStageTypeIndex.toString()] = stage.inboxStageTitle;
    }
  }

  $: selected = {
    stageTypeIndex: selectedIndex,
    stageTitle: options[selectedIndex],
  };
</script>

<Dialog.Root>
  <Dialog.Trigger>
    <Button variant="destructive" class="h-9 gap-2">
      <MoveLeft size="18" />
      Rollback
    </Button>
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Rollback Request</Dialog.Title>
      <Dialog.Description>
        <p>
          Once a request has been rolled back, it will have to pass through all
          of the in-between stages again.
        </p>
        <p>This cannot be undone.</p>
      </Dialog.Description>
      <Separator />
    </Dialog.Header>
    <div class="flex flex-col gap-8">
      <div class="flex flex-col gap-4">
        <Label>Current Stage:</Label>
        <Button variant="outline" class="pointer-events-none">
          Stage {stage.currentStageTypeIndex}: {stage.stageTitle}.
        </Button>
      </div>
      <div class="flex flex-col gap-4">
        <Label>Rollback to:</Label>
        <DD.DropdownMenu>
          <DD.DropdownMenuTrigger class="group flex flex-row items-center">
            <div
              class="group-hover:bg-secondary flex h-full items-center rounded-l-xl border px-1 transition"
            >
              <ChevronDown />
            </div>
            <Button
              variant="outline"
              class="group-hover:bg-secondary w-full gap-4 rounded-l-none"
            >
              Stage {selectedIndex}: {options[selectedIndex]}
            </Button>
          </DD.DropdownMenuTrigger>
          <DD.DropdownMenuContent>
            <DD.DropdownMenuLabel>Rollback to</DD.DropdownMenuLabel>
            <DD.DropdownMenuSeparator />
            <DD.DropdownMenuRadioGroup
              value={selectedIndex}
              onValueChange={(value) => {
                if (value) selectedIndex = value;
              }}
            >
              {#each Object.keys(options) as optionStageIndex}
                <DD.DropdownMenuRadioItem
                  class={selectedIndex === optionStageIndex
                    ? "border-gray border"
                    : ""}
                  value={optionStageIndex}
                >
                  Stage {optionStageIndex}: {options[optionStageIndex]}
                </DD.DropdownMenuRadioItem>
              {/each}
            </DD.DropdownMenuRadioGroup>
          </DD.DropdownMenuContent>
        </DD.DropdownMenu>
      </div>
    </div>
    <Dialog.Footer>
      <form action="?/rollback_stage" method="POST" use:enhance={enhanceFunc}>
        <input type="hidden" name="requestId" value={stage.requestId} />
        <input type="hidden" name="inboxStageTypeIndex" value={selectedIndex} />
        <Button class="h-9" variant="destructive" type="submit">
          I'm sure. Rollback.
        </Button>
      </form>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
