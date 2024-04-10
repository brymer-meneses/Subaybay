<script lang="ts">
    import {disabledColor, mainBGColor, deleteColor, deleteHoverColor, addColor, addHoverColor, subBGColor, headerColor, UserData} from "./configConstants";
    import {height} from "./configConstants";
    import {ButtonType} from "./configConstants";
    import ConfigStageButton from "./configStageButton.svelte";
    import {flip} from 'svelte/animate';

    export let users : UserData[];

    export let stageNumber = 1;
    export let buttonType : ButtonType = ButtonType.Disabled;

    export let substages : string[] = [];
    export let onClick = () => {};
    
    let defaultColor = disabledColor;
    let hoverColor = disabledColor;

    let substageCount = substages.length; //Needed to trigger a re-render

    $: switch (buttonType) {
        case ButtonType.Delete:
            defaultColor = deleteColor;
            hoverColor = deleteHoverColor;
            break;
        case ButtonType.Disabled:
            defaultColor = disabledColor;
            hoverColor = disabledColor;
            break;
        case ButtonType.Add:
            defaultColor = addColor;
            hoverColor = addHoverColor;
            break;
    }

    $: buttonColor = defaultColor;

    function onButtonHoverStart() {
        buttonColor = hoverColor;
    }

    function onButtonHoverEnd() {
        buttonColor = defaultColor;
    }

    function deleteSubstage(index : number) {
        substages.splice(index, 1);
        substageCount = substages.length;
    }
    
    function addSubstage() {
        substages.push("New Step (Click to Rename)");
        substageCount = substages.length;
    }
</script>

{#key substageCount}
<div class="m-2 rounded-lg" style="background-color:{mainBGColor};">

    <div class="m-0 p-0 flex border-black border-1 items-center" style="width: 500;"> <!--Header-->
        <!-- svelte-ignore a11y-no-static-element-interactions svelte-ignore a11y-click-events-have-key-events -->
        <div class="p-2 cursor-pointer rounded-tl-lg text-white flex items-center justify-center" 
            style="width: {height}px; height: {height}px; background-color: {buttonColor};
                border-bottom-left-radius: {buttonType == 1 ? '6px' : '0px'}"
                on:mouseenter={onButtonHoverStart} on:mouseleave={onButtonHoverEnd} on:click={onClick}></div>

        <div class="p-2 cursor-pointer rounded-tr-lg flex-grow" 
            style="height: {height}px; background-color:{headerColor};
                border-bottom-right-radius: {buttonType == 1 ? '6px' : '0px'}">
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
            style="flex-grow;">
            {#if substages.length >= 1}
                <ConfigStageButton buttonType={0} stageName={substages[0]} isRenamable={buttonType != 0} isLast={buttonType == 0} users={users} />
            {/if}
            {#if substages.length >= 2}
                {#each substages as stage, index}
                    {#if index > 0}
                        <ConfigStageButton buttonType={-1} stageName={stage} onClick={() => deleteSubstage(index)} users={users} />
                    {/if}
                {/each}
            {/if}
        </div>
        {#if buttonType != ButtonType.Disabled}
            <ConfigStageButton buttonType={1} stageName={"Add New"} isLast={true} isRenamable={false} onClick={addSubstage} users={users}/>
        {/if}
    {/if}
</div>
{/key}