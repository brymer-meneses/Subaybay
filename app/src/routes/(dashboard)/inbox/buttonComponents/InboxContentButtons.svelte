<script lang="ts">
  import PassToNextButton from "./PassToNextButton.svelte";
  import ReassignButton from "./ReassignButton.svelte";
  import RollbackButton from "./RollbackButton.svelte";
  import ArchiveButton from "./ArchiveButton.svelte";

  import type { MultiStageData } from "../inboxTypes";
  import type { Request } from "$lib/server/database";

  export let request: Request;
  export let multiStage: MultiStageData;
  export let users: { [key: string]: User };
  export let updateSelectedStage: () => void;
  export let processing = false;

  $: stage = multiStage.mainStage;

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
    {#if stage.finalStageTypeIndex == stage.currentStageTypeIndex}
      <ArchiveButton {stage} {enhanceFunc} />
    {:else}
      <PassToNextButton {users} {stage} {request} {enhanceFunc} />
    {/if}
    <!--If in pending inbox-->
  {:else}
    <RollbackButton {multiStage} {enhanceFunc} />
  {/if}
{:else}
  Processing... Please Wait...
{/if}
