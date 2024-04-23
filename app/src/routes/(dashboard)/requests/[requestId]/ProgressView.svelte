<script lang="ts">
  import { ScrollArea } from "$lib/components/ui/scroll-area";
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
  import CircleX from "lucide-svelte/icons/circle-x";
  import CircleUserRound from "lucide-svelte/icons/circle-user-round";
  import CircleCheck from "lucide-svelte/icons/circle-check";
  import { Input } from "$lib/components/ui/input";
  
  export let request: any;
  export let requestType: any;
  export let users: { [_id: string]: { name: string; profileUrl: string } };

  //todo add type
  let stages: any[] = [];
  let ready = false;

  for (let stageArray of requestType.stages) {
    const stage: any[] = [];
    stages.push(stage);
    for (let stageType of stageArray) {
      const substage = {
        title: stageType.stageTitle,
        handler: stageType.defaultHandler,
        finished: false,
      };
      stage.push(substage);
    }
  }

  for (let storedStage of request.history) {
    const substage =
      stages[storedStage.stageTypeIndex][storedStage.substageTypeIndex];
    substage.finished = true;
    substage.handler = storedStage.handler;
  }

  for (let storedStage of request.currentStages) {
    const substage =
      stages[storedStage.stageTypeIndex][storedStage.substageTypeIndex];
    substage.finished = storedStage.finished;
    substage.handler = storedStage.handler;
    console.log(substage);
  }

  console.log("hello 4");
</script>

<ScrollArea>
  {#each stages as stage, stageIndex}
    <Card class="flex flex-col border-gray-300">
      <CardContent class="items-center">
        {#each stage as substage, substageIndex}
          <div class="flex flex-row gap-2">
            {#if substage.finished}
              <CircleCheck class="stroke-1"/> <!--Change color to green-->
            {:else}
              <CircleX class="stroke-muted-foreground stroke-1" />
            {/if}

            <!--todo change to appropriate component-->
            <Input placeholder="No Name" disabled={true} value={substage.title} />

            <div class="ml-2">
              {#if !substage.handler}
                <CircleUserRound
                  class="stroke-muted-foreground h-8 w-8 stroke-1"
                />
              {:else}
                <Avatar class="h-8 w-8">
                  <AvatarImage
                    src={users[substage.handler].profileUrl}
                    alt={users[substage.handler].name}
                  />
                </Avatar>
              {/if}
            </div>
          </div>
        {/each}
      </CardContent>
    </Card>
  {/each}
</ScrollArea>
