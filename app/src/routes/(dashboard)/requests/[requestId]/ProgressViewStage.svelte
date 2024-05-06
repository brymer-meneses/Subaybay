<script lang="ts">
  
  import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "$lib/components/ui/avatar";
  import {
    LoaderCircle,
    Circle,
    CircleCheckBig,
    CircleUserRound,
    CircleX,
  } from "lucide-svelte";
  import { Label } from "$lib/components/ui/label";

  interface StageData {
    isHistory: boolean;
    isCurrent: boolean;
    finished: boolean;
    title: string;
    handlerId: string;
  }

  export let stage: StageData;
  export let users: { [_id: string]: { name: string; profileUrl: string } };
</script>

<div
  class="margin-top-1 flex flex-row items-center gap-2
    rounded-lg border border-2 p-2
    {stage.isHistory
    ? 'border-emerald-600'
    : stage.isCurrent
      ? 'border-sky-600'
      : 'border-gray-400'}">
  {#if stage.finished}
    <CircleCheckBig class="stroke-2 text-emerald-600" />
  {:else if stage.isCurrent}
    <LoaderCircle class="stroke-2 text-sky-600" />
  {:else}
    <Circle class="stroke-2 text-gray-400" />
  {/if}

  <Label class="flex flex-grow flex-row" placeholder="No Name">
    {stage.title}
  </Label>

  <div class="ml-2">
    {#if !(stage.handlerId in users)}
      <CircleUserRound class="stroke-muted-foreground h-8 w-8 stroke-1" />
    {:else}
      <Avatar class="h-8 w-8">
        <AvatarImage
          src={users[stage.handlerId].profileUrl}
          alt={users[stage.handlerId].name}
        />
      </Avatar>
    {/if}
  </div>
</div>