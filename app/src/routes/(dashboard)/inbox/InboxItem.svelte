<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import type { InboxStageData } from "./inboxTypes";

  export let stage: InboxStageData;

  import clsx from "clsx";

  export let isSelected: boolean;
  export let onClick: () => void = () => {};
</script>

<Button
  class={clsx("flex h-min w-full rounded-lg p-4")}
  variant={isSelected ? "secondary" : "outline"}
  on:click={onClick}
>
  <div class="flex w-full flex-col gap-2">
    <div class="flex w-full flex-row justify-between gap-0">
      <p class="text-base font-semibold">
        {stage.studentName}
        <span class="text-muted-foreground text-xs">
          ({stage.studentNumber})
        </span>
      </p>
      <div class=""></div>
    </div>
    <div class="flex flex-row">
      <p class="text-muted-foreground text-xs">
        Step {stage.currentStageTypeIndex}:
        <span class="font-normal">{stage.inboxStageTitle}</span>
      </p>
    </div>
    <div class="flex w-full flex-row justify-between">
      <p
        class="text-muted-foreground text-xs font-normal"
        title={stage.requestTitle}
      >
        {#if stage.requestTitle.length > 30}
          {stage.requestTitle.substring(0, 30) + "..."}
        {:else}
          {stage.requestTitle}
        {/if}
      </p>
      <p class="text-xs font-normal">
        {stage.dateSent.toLocaleString()}
      </p>
    </div>
  </div>
</Button>
