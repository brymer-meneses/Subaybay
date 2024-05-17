<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import MoveLeft from "lucide-svelte/icons/move-left";
  import CheckCheck from "lucide-svelte/icons/check-check";

  import { enhance } from "$app/forms";

  import FinishButton from "./FinishButton.svelte";
  import ReassignButton from "./ReassignButton.svelte";
  import RollbackButton from "./RollbackButton.svelte";
  import ArchiveButton from "./ArchiveButton.svelte";

  import type { InboxStageData } from "../inboxTypes";
  import type { Request } from "$lib/server/database";

  export let request: Request | null;
  export let stage: InboxStageData;
  export let users: any;
  export let updateSelectedStage: () => void;
  export let processing = false;

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
    <!--If in active inbox-->
    {#if stage.currentStageTypeIndex == stage.inboxStageTypeIndex}
      {#if stage.final}
        <ArchiveButton {stage} {enhanceFunc} />
      {:else}
        <FinishButton {users} {stage} {request} {enhanceFunc} />
      {/if}
      <ReassignButton {users} {stage} {request} {enhanceFunc} />

    <!--If in pending inbox-->
    {:else}
      <RollbackButton {stage} {enhanceFunc} />
    {/if}
  </div>
{:else}
  Processing... Please Wait...
{/if}
