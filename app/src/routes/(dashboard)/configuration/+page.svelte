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
  import { enhance } from "$app/forms";

  export let data: PageServerData;

  let stages: StageData[] = [];
  let requestType: string;
  let processing: boolean = false;

  let users = [new UserData("", "None")];
  for (const user of data.allUsers) {
    users.push(new UserData(user.id, user.name, user.profileUrl));
  }

  stages = [new StageData("Newly Created Request", 0), new StageData()];

  function deleteStage(index: number) {
    stages = stages.slice(0, index).concat(stages.slice(index + 1));
  }

  function addSubstage() {
    stages = [...stages, new StageData()];
  }

  function editHandler(stageIndex: number, handlerIndex: number) {
    stages[stageIndex].handlerIndex = handlerIndex;
  }

  async function handleSubmit(e: any) {
    const data = new FormData(e.formElement);

    data.append("stageData", JSON.stringify(stages));
    data.append("users", JSON.stringify(users));
    data.append("requestType", requestType);

    processing = true;

    const response = await fetch(e.action, {
      method: "POST",
      body: data,
    });

    processing = false;
  }
</script>

<main class="flex justify-center">
  <div class="flex w-[40%] flex-col gap-4">
    <Input
      bind:value={requestType}
      class="focus-visible:ring-0"
      placeholder="Request Type Title (e.g. OTR-1)"
    />
    <span>{requestType}</span>
    <Card class="flex flex-col border-gray-300">
      <CardHeader>
        <CardTitle>Stages</CardTitle>
        <CardDescription>
          Note: the first stage is always the creation stage, it cannot be
          removed
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-2">
        {#each stages as stageData, stageIndex}
          <ConfigStage
            bind:substageName={stageData.stageName}
            isDeletable={stageIndex !== 0}
            isRenamable={stageIndex !== 0}
            {stageIndex}
            handlerIndex={stageData.handlerIndex}
            deleteFunction={deleteStage}
            onHandlerEdited={editHandler}
            {users}
          />
        {/each}

        <!--Button for adding new stage-->
        <Button variant="outline" class="w-full" on:click={addSubstage}>
          <Plus class="stroke-muted-foreground stroke-1" />
        </Button>
      </CardContent>
    </Card>

    <div class="flex justify-center">
      <form
        action="?/create"
        method="POST"
        use:enhance={(event) => handleSubmit}
      >
        {#if !processing}
          <Button type="submit">Create</Button>
        {:else}
          Processing... Please Wait
        {/if}
      </form>
    </div>
  </div>
</main>
