<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { Separator } from "$lib/components/ui/separator";
  import type { InboxStageData } from "./inboxTypes";

  export let stage: InboxStageData;

  import clsx from "clsx";

  export let isSelected: boolean;
  export let onClick: () => void = () => {};
</script>

<Button
  class={clsx(
    "flex h-[8.5rem] w-[48rem] flex-row items-start rounded-2xl hover:text-white",
    isSelected ? "bg-primary text-white" : "bg-accent text-black",
  )}
  on:click={onClick}
>
  <div class="flex w-full flex-col items-start gap-1">
    <div class="flex w-full flex-row justify-between">
      <p class="text-base font-semibold">{stage.stageTitle}</p>
      <p class="text-xs">{stage.requestId}</p>
    </div>
    <Separator
      class={clsx("hover:bg-black", isSelected ? "bg-white" : "bg-black")}
      on:click={onClick}
    />
    <p class="text-sm">{stage.requestTitle}</p>
    <p class="text-xs">{stage.dateSent}</p>
    <p class="text-xs">
      Step: {stage.currentStageTypeIndex}
    </p>
    {#if stage.currentStageTypeIndex != stage.inboxStageTypeIndex}
      <p class="text-xs">
        You handled Step: {stage.inboxStageTypeIndex}
      </p>
    {/if}
  </div>
</Button>
