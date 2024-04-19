<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { UserData, SubstageData } from "./configClasses";
  import ConfigStageContainer from "./configStageContainer.svelte";
  import defaultProfilePic from "$lib/assets/circle-user-round.png";
  import Input from "../ui/input/input.svelte";

  export let dbUsers: { id: string; name: string; profileUrl: string }[];

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

  function deleteStage(index: number) {
    stages = stages.slice(0, index).concat(stages.slice(index + 1));
  }

  function addStage() {
    stages = [...stages, [new SubstageData()]];
  }

  async function handleSubmit(event: any) {
    const data = new FormData(event.currentTarget);

    data.append("stageData", JSON.stringify(stages));
    data.append("users", JSON.stringify(users));
    data.append("requestType", requestType);

    const response = await fetch(event.currentTarget.action, {
      method: "POST",
      body: data,
    });
  }
</script>

<!--Todo? Use <Form>-->
{#key stages}
  <div class="flex justify-center">
    <div class="w-600 grid grid-cols-1 gap-5">
      <Input
        bind:value={requestType}
        class="focus-visible:ring-0"
        placeholder="Request Type (e.g. OTR-1)"
      />
      {#if stages.length > 0}
        <ConfigStageContainer stageIndex={0} {stages} {users} />

        {#if stages.length > 0}
          {#each stages as _, stageIndex}
            {#if stageIndex > 0}
              <ConfigStageContainer
                {stageIndex}
                deleteStageFunction={deleteStage}
                {stages}
                {users}
              />
            {/if}
          {/each}
        {/if}
      {/if}
      <Button class="border-gray-300" variant="outline" on:click={addStage}
        >Add New Stage</Button
      >

      <div class="flex justify-center">
        <form method="POST" on:submit|preventDefault={handleSubmit}>
          <Button type="submit">Create</Button>
        </form>
      </div>
    </div>
  </div>
{/key}
