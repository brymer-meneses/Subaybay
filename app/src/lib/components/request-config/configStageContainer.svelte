<script lang="ts">
    import { disabledColor, mainBGColor, deleteColor, deleteHoverColor, addColor, addHoverColor, subBGColor, headerColor } from "./configConstants";
    import { height } from "./configConstants";
    import { ButtonType, UserData, SubstageData } from "./configConstants";
    import ConfigStageButton from "./configStageButton.svelte";

    export let users : UserData[];

    export let stageNumber = 1;
    export let buttonType : ButtonType = ButtonType.Disabled;

    export let substages : SubstageData[] = [];
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
        substages.push(new SubstageData("New Substage (Click to Rename)", 0));
        substageCount = substages.length;
    }

    function editHandler(stageIndex : number, handlerIndex : number) {
        substages[stageIndex].handlerIndex = handlerIndex;
    }
</script>

{#key substageCount}
<div class="m-2 rounded-lg" style="background-color:{mainBGColor};">

     <!--Header-->
    <div class="m-0 p-0 flex border-black border-1 items-center" style="width: 500;">
        <!-- svelte-ignore a11y-no-static-element-interactions svelte-ignore a11y-click-events-have-key-events -->
        <div class="p-2 cursor-pointer rounded-tl-lg text-white flex items-center justify-center" 
            style="width: {height}px; height: {height}px; background-color: {buttonColor};
                border-bottom-left-radius: {buttonType == 1 ? '6px' : '0px'}"
                on:mouseenter={onButtonHoverStart} on:mouseleave={onButtonHoverEnd} on:click={onClick}></div>

        <div class="p-2 rounded-tr-lg flex-grow" 
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
        <div class="m-0 p-0 rounded-bl-lg rounded-br-lg" 
            style="flex-grow;">
            {#if substages.length >= 1}
                <ConfigStageButton buttonType={ButtonType.Disabled} stageIndex={0} handlerIndex={substages[0].handlerIndex} stageName={substages[0].stageName} isRenamable={buttonType != 0} isLast={buttonType == 0} 
                    onEditHandler={editHandler} users={users} />
            {/if}
            {#if substages.length >= 2}
                {#each substages as substageData, index}
                    {#if index > 0}
                        <ConfigStageButton buttonType={ButtonType.Delete} stageIndex={index} stageName={substageData.stageName} handlerIndex={substageData.handlerIndex}
                            onButtonClick={() => deleteSubstage(index)} onEditHandler={editHandler} users={users} />
                    {/if}
                {/each}
            {/if}
        </div>
        {#if buttonType != ButtonType.Disabled}
            <ConfigStageButton buttonType={ButtonType.Add} stageIndex={substages.length - 1} stageName={"Add New"} handlerIndex={0} isLast={true} isRenamable={false} 
                onButtonClick={addSubstage} users={users}/>
        {/if}
    {/if}
</div>
{/key}