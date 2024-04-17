<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { UserData, SubstageData } from "./configConstants";
  import ConfigStageContainer from "./configStageContainer.svelte";
  import defaultProfilePic from "$lib/assets/defaultProfilePic.jpg";

  let stages: SubstageData[][] = [];

  //hardcoded dummy data - to be replaced
  let users: UserData[] = [
    new UserData("-1", "None", defaultProfilePic),
    new UserData(
      "1",
      "Yuumi",
      "https://www.mobafire.com/images/champion/square/yuumi.png",
    ),
    new UserData(
      "2",
      "Gnar",
      "https://www.mobafire.com/images/champion/square/gnar.png",
    ),
    new UserData(
      "3",
      "Smolder",
      "https://www.mobafire.com/images/champion/square/smolder.png",
    ),
    new UserData(
      "4",
      "Aurelion Sol",
      "https://www.mobafire.com/images/champion/square/aurelion-sol.png",
    ),
  ];

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
    //todo convert stages into a prompt on the database; all of the information is already there
  }
</script>

{#key stages.length}
  <div
    class="justify-center flex"
    style="overflow-y: auto; height: 100%; padding-bottom: 200px;" 
  > <!--todo make this use tailwind-->
    <div class="grid grid-cols-1 gap-5" style="width:600px; margin-top: 10px; margin-bottom: 100px;"> <!--todo make this use tailwind-->
      <input placeholder="Request Name" />
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
                onClick={() => deleteStage(stageIndex)}
                {stages}
                {users}
              />
            {/if}
          {/each}
        {/if}

        {/if}
      
      <div>
        <Button class="color-pale-yellow" on:click={addStage}>Add New Stage</Button>
      </div>
      <div>
        <Button>Submit</Button>
      </div>

      <div class="flex" style="height: 200px;"></div>
    </div>
  </div>
{/key}

