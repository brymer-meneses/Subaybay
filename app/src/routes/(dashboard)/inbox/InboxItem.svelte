<script lang="ts">
  import { page } from "$app/stores";
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
        <span class="text-xs text-muted-foreground">
          ({stage.studentNumber})
        </span>
      </p>
      <div class=""></div>
    </div>
    <div class="flex flex-row">
      <p class="text-xs text-muted-foreground">
        Step {stage.currentStageTypeIndex}:
        <span class="font-normal">{stage.inboxStageTitle}</span>
      </p>
    </div>
    <div class="flex w-full flex-row justify-between">
      <p
        class="text-xs font-normal text-muted-foreground"
        title={stage.requestTitle}
      >
        {#if stage.requestTitle.length > 40}
          {stage.requestTitle.substring(0, 40) + "..."}
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
