<script lang="ts">
  import { enhance } from "$app/forms";
  import type { InboxStageData } from "../inboxTypes";
  import type { Request } from "$lib/server/database";

  import * as Dialog from "$lib/components/ui/dialog";
  import { Button } from "$lib/components/ui/button";
  import PopoverButton from "./PopoverButton.svelte";

  import UserIcon from "lucide-svelte/icons/user";

  export let users: { [key: string]: User };
  export let stage: InboxStageData;
  export let request: Request | null;
  export let enhanceFunc: any;

  let nextHandlerId: string = request?.nextHandlerId ?? "";
  let processing: boolean;
</script>

<PopoverButton
  {users}
  {processing}
  handlerSelectTitle={"Select Replacement Handler"}
  bind:nextHandlerId
>
  <Button variant="outline" slot="button" class="h-9.5 gap-2">
    <UserIcon size={18} /> Reassign
  </Button>

  <Dialog.Root>
    <Dialog.Trigger disabled={nextHandlerId in users ? false : true}>
      <Button class="h-9" disabled={nextHandlerId in users ? false : true}>
        Reassign
      </Button>
    </Dialog.Trigger>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Are you sure?</Dialog.Title>
        <Dialog.Description>
          This will reassign this stage to
          <strong>
            {users[nextHandlerId].name}
          </strong>. <br />
          It will NOT be moved to your pending inbox.
          <br />
          <br />
          The stage can be reassigned back to you from the request's details page
        </Dialog.Description>
      </Dialog.Header>

      <Dialog.Footer>
        <form action="?/reassign_stage" method="POST" use:enhance={enhanceFunc}>
          <input type="hidden" name="requestId" value={stage.requestId} />
          <input type="hidden" name="nextHandlerId" value={nextHandlerId} />
          <Button class="h-9" variant="destructive" type="submit"
            >I'm Sure. Reassign.</Button
          >
        </form>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>
</PopoverButton>
