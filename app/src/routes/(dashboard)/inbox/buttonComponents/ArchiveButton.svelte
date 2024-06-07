<script lang="ts">
  import { enhance } from "$app/forms";
  import type { InboxStageData } from "../inboxTypes";

  import { Switch } from "$lib/components/ui/switch";

  import * as Dialog from "$lib/components/ui/dialog";
  import { Button } from "$lib/components/ui/button";

  import { CheckCheck } from "lucide-svelte";
  import { Card } from "$lib/components/ui/card";

  export let stage: InboxStageData;
  export let enhanceFunc: any;

  let shouldSendEmail = false;
</script>

<Dialog.Root>
  <Dialog.Trigger>
    <Button class="h-9 gap-2">
      <CheckCheck size="18" />
      Finish and Archive
    </Button>
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Are you sure?</Dialog.Title>
      <Dialog.Description>
        This will mark the request as finished and remove it from all inboxes. <br
        />
        It will still be accessible from the 'Finished' requests page. <br />
        <br />
        This cannot be undone.
        <br />
        Are you sure?
      </Dialog.Description>
    </Dialog.Header>

    <Card class="flex items-center justify-between p-3">
      <p class="text-sm">Send email to the student</p>
      <Switch bind:checked={shouldSendEmail} />
    </Card>

    <Dialog.Footer>
      <form action="?/finish_stage" method="POST" use:enhance={enhanceFunc}>
        <input type="hidden" name="requestId" value={stage.requestId} />
        <input type="hidden" name="nextHandlerId" value={""} />
        <input type="hidden" name="shouldSendEmail" value={shouldSendEmail} />

        <Button class="h-9" variant="destructive" type="submit">
          I'm Sure, archive.
        </Button>
      </form>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
