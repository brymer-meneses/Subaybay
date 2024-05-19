<script lang="ts">
  import type { InboxStageData } from "./inboxTypes";

  export let stage: InboxStageData;

  import clsx from "clsx";

  export let isSelected: boolean;
  export let onClick: () => void = () => {};
</script>

<button
  class={clsx(
    "flex w-full flex-row items-center rounded-md  p-4",
    isSelected ? "bg-primary text-white" : "bg-accent",
  )}
  on:click={onClick}
>
  <div class="flex w-full flex-col items-start gap-1">
    <div class="flex w-full flex-row justify-between">
      <p class="text-base font-semibold">{stage.stageTitle}</p>
      <p class="text-xs font-thin text-gray-600">{stage.requestId}</p>
    </div>

    <p class="text-sm">{stage.requestTitle}</p>
    <p class="text-xs font-thin text-gray-400">{stage.dateSent}</p>
    <p class="text-xs font-thin text-gray-400">
      Step: {stage.currentStageTypeIndex}
    </p>
    {#if stage.currentStageTypeIndex != stage.inboxStageTypeIndex}
      <p class="text-xs font-thin text-gray-400">
        You handled Step: {stage.inboxStageTypeIndex}
      </p>
    {/if}
  </div>
</button>
