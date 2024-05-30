<script lang="ts">
  import * as DD from "$lib/components/ui/dropdown-menu";
  import * as Dialog from "$lib/components/ui/dialog";
  import { Button } from "$lib/components/ui/button";
  import { MoveLeft } from "lucide-svelte/icons";
  import { enhance } from "$app/forms";
  import type { MultiStageData } from "../inboxTypes";

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
      <Dialog.Title>Are you sure?</Dialog.Title>
      <Dialog.Description>
        This request is currently at
        <strong>
          Stage {stage.currentStageTypeIndex}: {stage.stageTitle}
        </strong>. <br />

        This will rollback the request to
        <strong>
          <DD.DropdownMenu>
            <DD.DropdownMenuTrigger>
              <div
                class="flex flex-col items-center gap-x-4 rounded-lg border border-gray-300 p-1"
              >
                Stage {selectedIndex}: {options[selectedIndex]}
              </div>
            </DD.DropdownMenuTrigger>
            <DD.DropdownMenuContent>
              <DD.DropdownMenuLabel>Send to</DD.DropdownMenuLabel>

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
                    {optionStageIndex}: {options[optionStageIndex]}
                  </DD.DropdownMenuRadioItem>
                {/each}
              </DD.DropdownMenuRadioGroup>
            </DD.DropdownMenuContent>
          </DD.DropdownMenu>
        </strong>

        <br />
        It will have to pass through all of the in-between stages again.
        <br />
        <br />
        This cannot be undone.
        <br />
        Are you sure?
      </Dialog.Description>
    </Dialog.Header>

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
