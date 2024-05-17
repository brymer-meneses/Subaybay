<script lang="ts">
  import FinishButton from "./FinishButton.svelte";
  import MoveLeft from "lucide-svelte/icons/move-left";
  import { enhance } from "$app/forms";

  import { Button } from "$lib/components/ui/button";

  export let selectedStage: any;
  export let users: any;
  export let updateSelectedStage: () => void;
  export let processing = false;

  let nextHandlerId: string;

  function enhanceFunc() {
    processing = true;

    return async ({ update }: any) => {
      await update();
      processing = false;
      updateSelectedStage();
    };
  }
</script>

{#if !processing}
  <div class="flex gap-2">
    <!--todo extract some of this stuff to other files-->
    <!--If in active inbox-->
    {#if selectedStage.currentStageTypeIndex == selectedStage.inboxStageTypeIndex}
      {#if selectedStage.final}
        <!--Todo add confirmation-->
        <Button type="submit">Finish and Archive</Button>
      {:else}
        <FinishButton {selectedStage} {users} {processing} bind:nextHandlerId>
          <form action="?/finish_stage" method="POST" use:enhance={enhanceFunc}>
            <input
              type="hidden"
              name="requestId"
              value={selectedStage.requestId}
            />
            <input type="hidden" name="nextHandlerId" value={nextHandlerId} />
            <Button
              type="submit"
              disabled={nextHandlerId in users ? false : true}
            >
              Confirm
            </Button>
          </form>
        </FinishButton>
      {/if}
    {:else}
      <form action="?/rollback_stage" method="POST" use:enhance={enhanceFunc}>
        <input type="hidden" name="requestId" value={selectedStage.requestId} />
        <input
          type="hidden"
          name="inboxStageTypeIndex"
          value={selectedStage.inboxStageTypeIndex}
        />
        <!--todo add confirmation-->
        <Button type="submit" class="gap-2 rounded-md" variant="destructive">
          <MoveLeft />
          Rollback
        </Button>
      </form>
    {/if}
  </div>
{:else}
  Processing... Please Wait...
{/if}
