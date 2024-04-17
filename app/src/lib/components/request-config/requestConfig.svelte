<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { ButtonType, UserData, SubstageData } from "./configConstants";
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
    [new SubstageData("", 0)],
  ];

  function deleteStage(index: number) {
    stages = stages.splice(index, 1);
  }

  function addStage() {
    stages = [...stages, [new SubstageData("New Substage (Click to Rename)", 0)]];
  }

  function storeInDatabase() {
    //todo convert stages into a prompt on the database; all of the information is already there
  }
</script>

{#key stages.length}
  <div
    class="justify-center flex"
    style="overflow-y: auto; height: 100%; padding-bottom: 200px;"
  >
    <div style="width:600px; margin-top: 10px; margin-bottom: 100px;">
      <input placeholder="Request Name" />
      {#if stages.length > 0}
        <ConfigStageContainer
          stageNumber={1}
          substages={stages[0]}
          {users}
        />

        {#if stages.length > 0}
          {#each stages as substages, index}
            {#if index > 0}
              <ConfigStageContainer
                stageNumber={index + 1}
                {substages}
                onClick={() => deleteStage(index)}
                {users}
              />
            {/if}
          {/each}
        {/if}

        {/if}
      
      <div>
        <Button class="color-pale-yellow">Add New Stage</Button>
      </div>
      <div>
        <Button>Submit</Button>
      </div>

      <div class="flex" style="height: 200px;"></div>
    </div>
  </div>
{/key}

