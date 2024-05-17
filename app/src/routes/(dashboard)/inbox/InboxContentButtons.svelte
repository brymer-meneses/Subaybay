<script lang="ts">
  import FinishButton from "./FinishButton.svelte";
  import MoveLeft from "lucide-svelte/icons/move-left";
  import CheckCheck from "lucide-svelte/icons/check-check";
  import User from "lucide-svelte/icons/user";

  import { enhance } from "$app/forms";

  import { Button } from "$lib/components/ui/button";
  import PopoverButton from "./PopoverButton.svelte";
  import Label from "$lib/components/ui/label/label.svelte";

  export let stage: any;
  export let users: any;
  export let updateSelectedStage: () => void;
  export let processing = false;

  let nextHandlerId: string = stage.nextHandlerId;

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
    {#if stage.currentStageTypeIndex == stage.inboxStageTypeIndex}
      {#if stage.final}
        <!--Todo add confirmation-->
        <Button type="submit">Archive</Button>
      {:else}
        <PopoverButton {users} {processing} bind:nextHandlerId>
          <Button slot="button" class="gap-2 rounded-md">
            <CheckCheck /> Finish
          </Button>
          <form action="?/finish_stage" method="POST" use:enhance={enhanceFunc}>
            <input type="hidden" name="requestId" value={stage.requestId} />
            <input type="hidden" name="nextHandlerId" value={nextHandlerId} />
            <Button
              type="submit"
              disabled={nextHandlerId in users ? false : true}
            >
              Confirm
            </Button>
          </form>
        </PopoverButton>
      {/if}
      <PopoverButton {users} {processing} bind:nextHandlerId>
        <Button slot="button" class="gap-2 rounded-md">
          <User /> Reassign
        </Button>
        <form action="?/reassign_stage" method="POST" use:enhance={enhanceFunc}>
          <input type="hidden" name="requestId" value={stage.requestId} />
          <input type="hidden" name="nextHandlerId" value={nextHandlerId} />
          <Button
            type="submit"
            disabled={nextHandlerId in users ? false : true}
          >
            Confirm
          </Button>
        </form>
      </PopoverButton>
    {:else}
      <form action="?/rollback_stage" method="POST" use:enhance={enhanceFunc}>
        <input type="hidden" name="requestId" value={stage.requestId} />
        <input
          type="hidden"
          name="inboxStageTypeIndex"
          value={stage.inboxStageTypeIndex}
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
