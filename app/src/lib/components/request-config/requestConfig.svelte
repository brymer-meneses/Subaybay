<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { UserData, SubstageData } from "./configClasses";
  import ConfigStageContainer from "./configStageContainer.svelte";
  import defaultProfilePic from "$lib/assets/defaultProfilePic.jpg";
  import Input from "../ui/input/input.svelte";

  export let dbUsers: {id: string, name: string, profileUrl: string}[];

  let stages: SubstageData[][] = [];
  let requestType: string;
  
  let users = [new UserData("", "None", defaultProfilePic)];
  for (const user of dbUsers) {
    users.push(new UserData(user.id, user.name, user.profileUrl));
  }
  
  stages = [
    [new SubstageData("Create/Submit Request", 0)],
    [new SubstageData()],
  ];

  $: stagesJSONStr = JSON.stringify(stages);

  function deleteStage(index: number) {
    stages = stages.slice(0, index).concat(stages.slice(index + 1));
  }

  function addStage() {
    stages = [...stages, [new SubstageData()]];
  }

  function storeInDatabase() {
    //todo pass the data for validation to the server
      //+ server will convert stages into a prompt on the database; all of the information is already there
  }

  function handleSubmit() {
    stagesJSONStr = JSON.stringify(stagesJSONStr);
  }
</script>

<!--Todo? Use <Form>-->
{#key stages}
<div class="justify-center flex">
  <div class="w-600 grid grid-cols-1 gap-5">
    <Input bind:value={requestType} class="focus-visible:ring-0" placeholder="Request Type (e.g. OTR-1)"/>
    {#if stages.length > 0}
      <ConfigStageContainer
        stageIndex={0}
        {stages}
        {users}
      />

      {#if stages.length > 0}
        {#each stages as _, stageIndex}
          {#if stageIndex > 0}
            <ConfigStageContainer
              stageIndex={stageIndex}
              deleteStageFunction={deleteStage}
              {stages}
              {users}
            />
          {/if}
        {/each}
      {/if}

      {/if}
    <Button class="border-gray-300" variant="outline" on:click={addStage}>Add New Stage</Button>

    <div class="justify-center flex">
      <form method="POST" on:submit={handleSubmit} action="?/create">
        <input type="hidden" name="requestType" bind:value={requestType}/>
        <input type="hidden" name="stageData" bind:value={stagesJSONStr}/>
        <Button type="submit">Create</Button>
      </form>
    </div>
  </div>
</div>
{/key}