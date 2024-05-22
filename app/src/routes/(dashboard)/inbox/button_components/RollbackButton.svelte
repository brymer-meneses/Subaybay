<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog";
  import { Button } from "$lib/components/ui/button";
  import { MoveLeft } from "lucide-svelte/icons";
  import { enhance } from "$app/forms";
  import type { InboxStageData } from "../inboxTypes";

  export let stage: InboxStageData;
  export let enhanceFunc;
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
        This will rollback the request to
        <strong>
          Stage {stage.inboxStageTypeIndex}: {stage.inboxStageTitle}
        </strong>. <br />
        It is currently at
        <strong>
          Stage {stage.currentStageTypeIndex}: {stage.stageTitle}
        </strong>. <br />
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
        <input
          type="hidden"
          name="inboxStageTypeIndex"
          value={stage.inboxStageTypeIndex}
        />
        <Button class="h-9" variant="destructive" type="submit">
          I'm sure. Rollback.
        </Button>
      </form>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
