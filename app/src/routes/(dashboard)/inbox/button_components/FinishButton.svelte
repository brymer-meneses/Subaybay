<script lang="ts">
  import { enhance } from "$app/forms";
  import type { InboxStageData, UserInfo } from "../inboxTypes";
  import type { Request } from "$lib/server/database";

  import { Button } from "$lib/components/ui/button";
  import PopoverButton from "./PopoverButton.svelte";

  import { CheckCheck } from "lucide-svelte";

  export let users: { [key: string]: UserInfo };
  export let stage: InboxStageData;
  export let request: Request;
  export let enhanceFunc: any;

  let processing: boolean;
</script>

<PopoverButton
  {users}
  {processing}
  handlerSelectTitle={"Select Next Handler"}
  bind:nextHandlerId={request.nextHandlerId}
>
  <Button slot="button" class="h-9 gap-2">
    <CheckCheck size="18" /> Pass to Next
  </Button>
  <form action="?/finish_stage" method="POST" use:enhance={enhanceFunc}>
    <input type="hidden" name="requestId" value={stage.requestId} />
    <input type="hidden" name="nextHandlerId" value={request.nextHandlerId} />
    <Button
      type="submit"
      disabled={request.nextHandlerId in users ? false : true}
      class="h-9"
    >
      Confirm
    </Button>
  </form>
</PopoverButton>
