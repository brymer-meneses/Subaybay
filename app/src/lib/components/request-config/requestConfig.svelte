<script lang="ts">
    import { ButtonType, UserData, SubstageData } from "./configConstants";
    import ConfigStageContainer from "./configStageContainer.svelte";
    import defaultProfilePic from "$lib/assets/defaultProfilePic.jpg";

    let stages : SubstageData[][] = []
    let stageCount = stages.length; //Needed to trigger a re-render

    let users : UserData[] = [
        new UserData("-1", "None", defaultProfilePic),
        new UserData("1", "Yuumi", "https://www.mobafire.com/images/champion/square/yuumi.png"),
        new UserData("2", "Gnar", "https://www.mobafire.com/images/champion/square/gnar.png"),
        new UserData("3", "Smolder", "https://www.mobafire.com/images/champion/square/smolder.png"),
        new UserData("4", "Aurelion Sol", "https://www.mobafire.com/images/champion/square/aurelion-sol.png")
    ];

    stages = [
        [new SubstageData("Create/Submit Request", 0)],
        [new SubstageData("New Substage (Click to Rename)", 0)]
    ]

    function deleteStage(index : number) {
        stages.splice(index, 1);
        stageCount = stages.length;
    }
    
    function addStage() {
        stages.push([new SubstageData("New Substage (Click to Rename)", 0)]);
        stageCount = stages.length;
    }

    function storeInDatabase() {
        //todo convert stages into a prompt on the database; all of the information is already there
    }
</script>

{#key stageCount}
<div class="justify-center flex" style="overflow-y: auto; height: 100%">
    <div style="width:600px; margin-top: 10px; margin-bottom: 100px;">
        {#if stages.length > 0}
            <ConfigStageContainer buttonType={ButtonType.Disabled} stageNumber={1} substages={stages[0]} users={users} />

            {#if stages.length > 0}
                {#each stages as substages, index}
                    {#if index > 0}
                        <ConfigStageContainer buttonType={ButtonType.Delete} stageNumber={index + 1} substages={substages} onClick={() => deleteStage(index)} users={users} />
                    {/if}
                {/each}
            {/if}

            <ConfigStageContainer buttonType={ButtonType.Add} stageNumber={0} onClick={addStage} users={users} />
        {/if}
    </div>
</div>
{/key}
