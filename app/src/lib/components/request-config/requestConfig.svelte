<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { UserData, SubstageData } from "./configClasses";
  import ConfigStageContainer from "./configStageContainer.svelte";
  import defaultProfilePic from "$lib/assets/defaultProfilePic.jpg";
  import Input from "../ui/input/input.svelte";

  export let dbUsers: {email: string, name: string, profileUrl: string}[];

  let stages: SubstageData[][] = [];
  let requestType: string;

  let users = [new UserData("-1", "None", defaultProfilePic)];
  for (const user of dbUsers) {
    users.push(new UserData(user.email, user.name, user.profileUrl))
  }

  stages = [
    [new SubstageData("Create/Submit Request", 0)],
    [new SubstageData()],
  ];

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
      <Button>Create</Button>
    </div>
  </div>
</div>
{/key}