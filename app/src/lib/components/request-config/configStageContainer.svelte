<script lang="ts">
  // import * as React from "react";
  import { Button } from "$lib/components/ui/button";
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "$lib/components/ui/card";

  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Avatar, AvatarFallback, AvatarImage } from "$lib/components/ui/avatar"
  
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "$lib/components/ui/select";
  
  import { UserData, SubstageData } from "./configConstants";
  import ConfigStageButton from "./configStageButton.svelte";

  export let users: UserData[];

  export let stageNumber = 1;

  export let substages: SubstageData[] = [];
  export let onClick = () => {};

  let substageCount = substages.length; //Needed to trigger a re-render

  function deleteSubstage(index: number) {
    substages.splice(index, 1);
    substageCount = substages.length;
  }

  function addSubstage() {
    substages.push(new SubstageData("New Substage (Click to Rename)", 0));
    substageCount = substages.length;
  }

  function editHandler(stageIndex: number, handlerIndex: number) {
    substages[stageIndex].handlerIndex = handlerIndex;
  }
</script>

<Card class="flex-grow border-black">
  <CardHeader class="border-black">
    <CardTitle>Stage {stageNumber}</CardTitle>
    {#if stageNumber == 1}
      <CardDescription>This is the request creation stage, it cannot be removed.</CardDescription>
    {/if}
  </CardHeader>
  <CardContent>
    <div class="grid grid-cols-10 gap-x-1 gap-y-1">
      {#if substages.length >= 1}
        <ConfigStageButton
          stageIndex={0}
          handlerIndex={substages[0].handlerIndex}
          stageName={substages[0].stageName}
          isRenamable={stageNumber != 1}
          isDeletable={false}
          onHandlerEdited={editHandler}
          {users}
        />
      {/if}
      {#if substages.length >= 2}
        {#each substages as substageData, index}
          {#if index > 0}
            <ConfigStageButton
              isDeletable={true}
              stageIndex={index}
              stageName={substageData.stageName}
              handlerIndex={substageData.handlerIndex}
              deleteFunction={() => deleteSubstage(index)}
              onHandlerEdited={editHandler}
              {users}
            />
          {/if}
        {/each}
      {/if}

      {#if stageNumber > 1}
        <!--Add Button-->
        <Button class="col-span-8 col-start-2" variant="outline">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
        </Button>   
      {/if}
    </div>    
  </CardContent>
  {#if stageNumber > 1}
    <CardFooter class="flex justify-between">
      <Button class="bg-pale-red-100" variant="outline" on:click={onClick}>Delete</Button>
    </CardFooter>
  {/if}
</Card>