<script lang="ts">
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "$lib/components/ui/card";
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
  import { Input } from "$lib/components/ui/input";

  interface SubstageData {
    title: string;
    handlerId: string;
    finished: boolean;
  }
  interface StageData {
    isHistory: boolean;
    isCurrent: boolean;
    substages: SubstageData[];
  }

  export let stage: StageData;
  export let users: { [_id: string]: { name: string; profileUrl: string } };
</script>

<Card
  class="flex flex-col border-2 {stage.isHistory
    ? 'border-emerald-600'
    : stage.isCurrent
      ? 'border-sky-600'
      : 'border-gray-400'}"
>
  <CardHeader>
    {#if stage.isHistory}
      Finished
    {:else if stage.isCurrent}
      Current Stage
    {:else}
      Upcoming
    {/if}
  </CardHeader>
  <CardContent class="flex flex-col gap-2">
    {#each stage.substages as substage, substageIndex}
      <div class="margin-top-1 flex flex-row items-center gap-2">
        {#if substage.finished}
          <CircleCheckBig class="stroke-2 text-emerald-600" />
        {:else if stage.isCurrent}
          <LoaderCircle class="stroke-2 text-sky-600" />
        {:else}
          <Circle class="stroke-2 text-gray-400" />
        {/if}

        <Label class="flex flex-grow flex-row" placeholder="No Name">
          {substage.title}
        </Label>

        <div class="ml-2">
          {#if !substage.handlerId}
            <CircleUserRound class="stroke-muted-foreground h-8 w-8 stroke-1" />
          {:else}
            <Avatar class="h-8 w-8">
              <AvatarImage
                src={users[substage.handlerId].profileUrl}
                alt={users[substage.handlerId].name}
              />
            </Avatar>
          {/if}
        </div>
      </div>
    {/each}
  </CardContent>
</Card>
