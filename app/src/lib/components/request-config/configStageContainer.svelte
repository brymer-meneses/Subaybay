<script lang="ts">
    import ConfigStageButton from "./configStageButton.svelte";
    import {flip} from 'svelte/animate';

    const headerColor = "#dadfe0";
    const bgColor = "#bdc3c7"
    const greenDefault = "#7bedbc";
    const greenHover = "#49d180";
    const redDefault = "#db2a4d";
    const redHover = "";
    const grayDefault = "#dadfe0";
    const grayHover = "#909599";

    export let stageNumber = 1;
    export let buttonSize = 40;

    export let subStages : string[] = [];
    
    //todo: this will be handled automatically based on some bools or enums
    export let leftColor = greenDefault;

</script>


<div class="m-2 p-0 rounded-lg" style="background-color:{bgColor}">
    <div class="m-0 p-0 flex border-black border-1 items-center p-1" style="width: 500;"> <!--Header-->
        <div class="p-2 cursor-pointer rounded-tl-lg text-white flex items-center justify-center" 
            style="width: {buttonSize}px; height: {buttonSize}px; background-color: {leftColor}"></div>
        <div class="p-2 cursor-pointer rounded-tr-lg flex-grow" 
            style="height: {buttonSize}px; background-color:{headerColor}">
            <strong>
                {#if stageNumber > 0}
                    Stage {stageNumber}
                {:else}
                    Add New Stage
                {/if}
            </strong>
        </div>
    </div>
    {#if stageNumber > 0}
        <div class="m-0 p-0 cursor-pointer rounded-bl-lg rounded-br-lg" 
            style="background-color:{bgColor}; flex-grow;">
            {#if subStages.length > 0}
                <ConfigStageButton leftColor="#909599" stageName={subStages[0]}></ConfigStageButton>
            {/if}
            {#if subStages.length > 1}
                {#each subStages as stage, index}
                    {#if index > 0}
                        <ConfigStageButton stageName={stage}></ConfigStageButton>
                    {/if}
                {/each}
            {/if}
        </div>
        <ConfigStageButton leftColor="#7bedbc" stageName={"Add New"}></ConfigStageButton>
    {/if}
</div>