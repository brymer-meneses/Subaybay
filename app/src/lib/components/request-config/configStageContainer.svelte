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

  import { UserData, SubstageData } from "./configClasses";
  import ConfigSubstage from "./configSubstage.svelte";

  export let stageIndex: number;
  export let stages: SubstageData[][];

  export let users: UserData[];

  export let deleteStageFunction = (stageIndex : number) => {};

  let substages = stages[stageIndex];

  function deleteSubstage(index: number) {
    substages = substages.slice(0, index).concat(substages.slice(index + 1))
    // stages = stages.slice(0, index).concat([substages]).concat(stages.slice(index + 1));
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

<Card class="flex-grow border-gray-300">
  <CardHeader class="border-black">
    <CardTitle class="col-span-*">Stage {stageIndex + 1}</CardTitle>
    {#if stageIndex == 0}
      <CardDescription>This is the request creation stage, it cannot be removed.</CardDescription>
    {/if}
  </CardHeader>
  <CardContent>
    <div class="grid grid-cols-10 gap-x-1 gap-y-1">
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
              substageIndex={substageIndex}
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
        <Button class="col-span-8 col-start-2" variant="outline" on:click={addSubstage}>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
        </Button>   
      {/if}
    </div>    
  </CardContent>
  {#if stageIndex > 0}
    <!--Button for deleting stage-->
    <CardFooter class="flex justify-between">
      <Button variant="outline" on:click={() => deleteStageFunction(stageIndex)}>Delete</Button>
    </CardFooter>
  {/if}
</Card>