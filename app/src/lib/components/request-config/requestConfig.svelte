<script lang="ts">
    import { ButtonType, UserData } from "./configConstants";
    import ConfigStageButton from "./configStageButton.svelte";
    import ConfigStageContainer from "./configStageContainer.svelte";
    import Dropdown from "./dropdown.svelte";
    import defaultProfilePic from "$lib/assets/defaultProfilePic.jpg";

    let stages : string[][] = []
    let stageCount = stages.length; //Needed to trigger a re-render

    let users : UserData[] = [
        new UserData("-1", "None", defaultProfilePic),
        new UserData("1", "Yuumi", "https://www.mobafire.com/images/champion/square/yuumi.png"),
        new UserData("2", "Gnar", "https://www.mobafire.com/images/champion/square/gnar.png"),
        new UserData("3", "Smolder", "https://www.mobafire.com/images/champion/square/smolder.png"),
    ];

    stages = [
        ["Create/Submit Request"],
        ["New Step (Click to Rename)"]
    ]

    function deleteStage(index : number) {
        stages.splice(index, 1);
        stageCount = stages.length;
    }
    
    function addStage() {
        stages.push(["New Stage"]);
        stageCount = stages.length;
    }

    function storeInDatabase() {
        
    }
</script>

{#key stageCount}
<div class="justify-center flex">
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
