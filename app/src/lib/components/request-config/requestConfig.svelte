<script lang="ts">
    import ConfigStageButton from "./configStageButton.svelte";
    import ConfigStageContainer from "./configStageContainer.svelte";

    let stages : string[][] = []

    stages = [
        ["Do Something"],
        ["Parallel 1","Parallel 2"],
        ["Final Thingy"]
    ]
</script>

<ConfigStageContainer leftColor="#909599" stageNumber={1} subStages={["Initial"]}></ConfigStageContainer>

{#if stages.length > 0}
    {#each stages as substages, number}
    <ConfigStageContainer leftColor="#db2a4d" stageNumber={number + 2} subStages={substages}></ConfigStageContainer>
    {/each}
{/if}

<ConfigStageContainer leftColor="#7bedbc" stageNumber={0}></ConfigStageContainer>

