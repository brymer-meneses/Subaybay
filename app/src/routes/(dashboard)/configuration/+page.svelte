<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { UserData, StageData } from "./configClasses";
  import Input from "$lib/components/ui/input/input.svelte";
  import type { PageServerData } from "./$types";
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "$lib/components/ui/card";
  import Plus from "lucide-svelte/icons/plus";
  import ConfigStage from "./ConfigStage.svelte";

  export let data: PageServerData;

  let stages: StageData[] = [];
  let requestType: string;

  let users = [new UserData("", "None")];
  for (const user of data.allUsers) {
    users.push(new UserData(user.id, user.name, user.profileUrl));
  }

  stages = [new StageData("Create Request", 0), new StageData()];

  function deleteStage(index: number) {
    stages = stages.slice(0, index).concat(stages.slice(index + 1));
  }

  function addSubstage() {
    stages = [...stages, new StageData()];
  }

  function editHandler(stageIndex: number, handlerIndex: number) {
    stages[stageIndex].handlerIndex = handlerIndex;
  }

  async function handleSubmit(event: any) {
    const data = new FormData(event.currentTarget);

    data.append("stageData", JSON.stringify(stages));
    data.append("users", JSON.stringify(users));
    data.append("requestType", requestType);

    const response = await fetch(event.target.action, {
      method: "POST",
      body: data,
    });

    location.reload();
  }
</script>

<main class="flex justify-center">
  <div class="flex w-[40%] flex-col gap-4">
    <Input
      bind:value={requestType}
      class="focus-visible:ring-0"
      placeholder="Request Type (e.g. OTR-1)"
    />
    {#if stages.length > 0}
      <Card class="flex flex-col border-gray-300">
        <CardHeader>
          <CardTitle>Stages</CardTitle>
          <CardDescription>
            Note: the first stage is always the creation stage, it cannot be
            removed
          </CardDescription>
        </CardHeader>
        <CardContent class="flex flex-col gap-2">
          {#if stages.length >= 1}
            <ConfigStage
              bind:substageName={stages[0].stageName}
              stageIndex={0}
              handlerIndex={stages[0].handlerIndex}
              isRenamable={false}
              isDeletable={false}
              onHandlerEdited={editHandler}
              {users}
            />
          {/if}
          {#if stages.length >= 2}
            {#each stages as stageData, stageIndex}
              {#if stageIndex > 0}
                <ConfigStage
                  bind:substageName={stageData.stageName}
                  isDeletable={true}
                  {stageIndex}
                  handlerIndex={stageData.handlerIndex}
                  deleteFunction={deleteStage}
                  onHandlerEdited={editHandler}
                  {users}
                />
              {/if}
            {/each}
          {/if}

          <!--Button for adding new stage-->
          <Button variant="outline" class="w-full" on:click={addSubstage}>
            <Plus class="stroke-muted-foreground stroke-1" />
          </Button>
        </CardContent>
      </Card>
    {/if}

    <div class="flex justify-center">
      <form action="?/create" method="POST" on:submit|preventDefault={handleSubmit}>
        <Button type="submit">Create</Button>
      </form>
    </div>
  </div>
</main>
