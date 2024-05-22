<script lang="ts">
  import Badge from "$lib/components/ui/badge/badge.svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Separator } from "$lib/components/ui/separator";
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
  <div class="flex w-full flex-col items-start gap-2">
    <div class="flex w-full flex-row justify-between">
      <p class="text-base font-semibold">{stage.stageTitle}</p>
      <p class="text-xs">{stage.requestId}</p>
    </div>
    <p class="text-sm">{stage.requestTitle}</p>

    <div class="flex flex-row gap-2">
      <Badge class="rounded-sm text-xs">
        Step {stage.currentStageTypeIndex}
      </Badge>
      <Badge class="rounded-sm text-xs" variant="outline"
        >{stage.dateSent.toLocaleString()}</Badge
      >
    </div>
    {#if stage.currentStageTypeIndex != stage.inboxStageTypeIndex}
      <p class="text-xs">
        You handled Step: {stage.inboxStageTypeIndex}
      </p>
    {/if}
  </div>
</Button>
