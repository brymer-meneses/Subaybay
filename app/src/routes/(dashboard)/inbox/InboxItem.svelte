<script lang="ts">
  export let stageTitle: string;
  export let requestTitle: string;
  export let requestId: string;
  export let dateSent: string;
  export let currentStageTypeIndex: number;
  export let inboxStageTypeIndex: number;

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
      <p class="text-base font-semibold">{stageTitle}</p>
      <p class="text-xs font-thin text-gray-600">{requestId}</p>
    </div>

    <p class="text-sm">{requestTitle}</p>
    <p class="text-xs font-thin text-gray-400">{dateSent}</p>
    <p class="text-xs font-thin text-gray-400">Step: {currentStageTypeIndex}</p>
    {#if currentStageTypeIndex != inboxStageTypeIndex}
    <p class="text-xs font-thin text-gray-400">You handled Step: {inboxStageTypeIndex}</p>
    {/if}
  </div>
</button>
