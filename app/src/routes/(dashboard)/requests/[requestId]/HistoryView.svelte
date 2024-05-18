<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import * as Avatar from "$lib/components/ui/avatar";
  import { Label } from "$lib/components/ui/label";
  import { ScrollArea } from "$lib/components/ui/scroll-area";

  import { CircleUserRound } from "lucide-svelte";

  import type { Request, RequestType } from "$lib/server/database";

  interface StageData {
    title: string;
    handlerId: string;
    dateFinished: Date;
  }

  export let request: Request;
  export let requestType: RequestType;
  export let users: { [_id: string]: { name: string; profileUrl: string } };

  let history: StageData[] = [];

  for (const storedStage of request.history) {
    const historicalStage: StageData = {
      title: requestType.stages[storedStage.stageTypeIndex].stageTitle,
      handlerId: storedStage.handlerId,
      dateFinished: storedStage.dateFinished,
    };
    history.push(historicalStage);
  }
</script>

<div class="flex flex-col gap-2 p-2">
  {#each history as substage}
    <Card.Card>
      <Card.CardContent class="flex flex-col gap-2 p-2">
        <div class="margin-top-1 flex flex-row items-center gap-2">
          <div class="ml-2">
            {#if !substage.handlerId}
              <CircleUserRound
                class="stroke-muted-foreground h-8 w-8 stroke-1"
              />
            {:else}
              <Avatar.Avatar class="h-8 w-8">
                <Avatar.AvatarImage
                  src={users[substage.handlerId].profileUrl}
                  alt={users[substage.handlerId].name}
                />
              </Avatar.Avatar>
            {/if}
          </div>

          <Label class="flex flex-grow flex-row" placeholder="No Name">
            {substage.title}
          </Label>
        </div>
      </Card.CardContent>
      <Card.CardFooter class="text-xs text-gray-500">
        {substage.dateFinished}
      </Card.CardFooter>
    </Card.Card>
  {/each}
</div>
