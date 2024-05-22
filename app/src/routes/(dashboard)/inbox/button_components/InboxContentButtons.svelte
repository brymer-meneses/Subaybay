<script lang="ts">
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
  <!--If in active inbox-->
  {#if stage.currentStageTypeIndex == stage.inboxStageTypeIndex}
    <ReassignButton {users} {stage} {request} {enhanceFunc} />
    {#if stage.final}
      <ArchiveButton {stage} {enhanceFunc} />
    {:else}
      <FinishButton {users} {stage} {request} {enhanceFunc} />
    {/if}
    <!--If in pending inbox-->
  {:else}
    <RollbackButton {stage} {enhanceFunc} />
  {/if}
{:else}
  Processing... Please Wait...
{/if}
