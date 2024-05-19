<script lang="ts">
  import { enhance } from "$app/forms";
  import type { InboxStageData, UserInfo } from "../inboxTypes";
  import type { Request } from "$lib/server/database";

  import { Button } from "$lib/components/ui/button";
  import PopoverButton from "./PopoverButton.svelte";

  import { User, CheckCheck } from "lucide-svelte";

  export let users: { [key: string]: UserInfo };
  export let stage: InboxStageData;
  export let request: Request | null;
  export let enhanceFunc: any;

  let nextHandlerId: string = request?.nextHandlerId ?? "";
  let processing: boolean;
</script>

<PopoverButton {users} {processing} bind:nextHandlerId>
  <Button slot="button" class="gap-2 rounded-md">
    <CheckCheck /> Finish
  </Button>
  <form action="?/finish_stage" method="POST" use:enhance={enhanceFunc}>
    <input type="hidden" name="requestId" value={stage.requestId} />
    <input type="hidden" name="nextHandlerId" value={nextHandlerId} />
    <Button type="submit" disabled={nextHandlerId in users ? false : true}>
      Confirm
    </Button>
  </form>
</PopoverButton>
