<script lang="ts">
    import {ButtonType} from "./configConstants";
    import ConfigStageButton from "./configStageButton.svelte";
    import ConfigStageContainer from "./configStageContainer.svelte";

    let stages : string[][] = []
    let stageCount = stages.length; //Needed to trigger a re-render

    stages = [
        ["Create Request"],
        ["Do Something"],
        ["Parallel 1","Parallel 2"],
        ["Final Thingy"]
    ]

    function deleteStage(index : number) {
        stages.splice(index, 1);
        stageCount = stages.length;
    }
    
    function addStage() {
        stages.push(["New Stage"]);
        stageCount = stages.length;
    }
</script>

{#key stageCount}
<div style="width:600px;">
    {#if stages.length > 0}
        <ConfigStageContainer buttonType={ButtonType.Disabled} stageNumber={1} substages={stages[0]}></ConfigStageContainer>

        {#if stages.length > 0}
            {#each stages as substages, index}
                {#if index > 0}
                    <ConfigStageContainer buttonType={ButtonType.Delete} stageNumber={index + 1} substages={substages} onClick={() => deleteStage(index)}></ConfigStageContainer>
                {/if}
            {/each}
        {/if}

        <ConfigStageContainer buttonType={ButtonType.Add} stageNumber={0} onClick={addStage}></ConfigStageContainer>
    {/if}
</div>
{/key}
