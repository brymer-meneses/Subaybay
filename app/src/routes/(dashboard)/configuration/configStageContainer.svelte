<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "$lib/components/ui/card";

  import Plus from "lucide-svelte/icons/plus";

  import { UserData, SubstageData } from "./configClasses";
  import ConfigSubstage from "./configSubstage.svelte";

  export let stageIndex: number;
  export let stages: SubstageData[][];

  export let users: UserData[];

  export let deleteStageFunction = (stageIndex: number) => {};

  let substages = stages[stageIndex];

  function deleteSubstage(index: number) {
    substages = substages.slice(0, index).concat(substages.slice(index + 1));
    stages[stageIndex] = substages;
  }

  function addSubstage() {
    substages = [...substages, new SubstageData()];
    stages[stageIndex] = substages;
  }

  function editHandler(substageIndex: number, handlerIndex: number) {
    substages[substageIndex].handlerIndex = handlerIndex;
    stages[stageIndex] = substages;
  }
</script>

<Card class="flex flex-col border-gray-300">
  <CardHeader>
    <CardTitle>Stage {stageIndex + 1}</CardTitle>
    {#if stageIndex == 0}
      <CardDescription
        >This is the request creation stage, it cannot be removed.</CardDescription
      >
    {/if}
  </CardHeader>
  <CardContent class="flex flex-col gap-2">
    {#if substages.length >= 1}
      <ConfigSubstage
        bind:substageName={substages[0].stageName}
        substageIndex={0}
        handlerIndex={substages[0].handlerIndex}
        isRenamable={stageIndex > 0}
        isDeletable={false}
        onHandlerEdited={editHandler}
        {users}
      />
    {/if}
    {#if substages.length >= 2}
      {#each substages as substageData, substageIndex}
        {#if substageIndex > 0}
          <ConfigSubstage
            bind:substageName={substageData.stageName}
            isDeletable={true}
            {substageIndex}
            handlerIndex={substageData.handlerIndex}
            deleteFunction={deleteSubstage}
            onHandlerEdited={editHandler}
            {users}
          />
        {/if}
      {/each}
    {/if}

    {#if stageIndex > 0}
      <!--Button for adding new substage-->
      <Button variant="outline" class="w-full" on:click={addSubstage}>
        <Plus class="stroke-muted-foreground stroke-1" />
      </Button>
    {/if}
  </CardContent>
  {#if stageIndex > 0}
    <!--Button for deleting stage-->
    <CardFooter class="flex justify-between">
      <Button variant="outline" on:click={() => deleteStageFunction(stageIndex)}
        >Delete</Button
      >
    </CardFooter>
  {/if}
</Card>
