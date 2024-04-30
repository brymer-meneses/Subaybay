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
  import { ScrollArea } from "$lib/components/ui/scroll-area";

  interface SubstageData {
    title: string;
    handlerId: string;
    dateFinished: Date;
  }

  export let request: any;
  export let requestType: any;
  export let users: { [_id: string]: { name: string; profileUrl: string } };

  let history: SubstageData[] = [];

  for (const storedStage of request.history) {
    const historicalStage: SubstageData = {
      title:
        requestType.stages[storedStage.stageTypeIndex][
          storedStage.substageTypeIndex
        ].stageTitle,
      handlerId: storedStage.handlerId,
      dateFinished: storedStage.dateFinished,
    };
    history.push(historicalStage);
  }
</script>

<div class="flex justify-center">
  <ScrollArea class="max-w-[600px] flex-grow gap-2">
    <div class="flex flex-col gap-2 p-2">
      {#each history as substage}
        <Card>
          <CardContent class="flex flex-col gap-2 p-2">
            <div class="margin-top-1 flex flex-row items-center gap-2">
              <div class="ml-2">
                {#if !substage.handlerId}
                  <CircleUserRound
                    class="stroke-muted-foreground h-8 w-8 stroke-1"
                  />
                {:else}
                  <Avatar class="h-8 w-8">
                    <AvatarImage
                      src={users[substage.handlerId].profileUrl}
                      alt={users[substage.handlerId].name}
                    />
                  </Avatar>
                {/if}
              </div>

              <Label
                class="flex flex-grow flex-row"
                placeholder="No Name"
              >
                {substage.title}
              </Label>
            </div>
          </CardContent>
          <CardFooter class="text-gray-500 text-xs">
            {substage.dateFinished}
          </CardFooter>
        </Card>
      {/each}
    </div>
  </ScrollArea>
</div>
