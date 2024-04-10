<script lang="ts">
    import { disabledColor, deleteColor, deleteHoverColor, addColor, addHoverColor, renamableColor, subBGColor } from "./configConstants";
    import { height, radius, buttonSize } from "./configConstants";
    import { ButtonType, UserData } from "./configConstants";
    import DropdownButton from "./dropdownButton.svelte";
    
    export let users : UserData[];

    export let isRenamable = true;
    export let isLast = false;
    export let stageName = "Stage Name";
    export let stageIndex : number;
    
    export let onButtonClick = () => {};
    export let buttonType : ButtonType = ButtonType.Disabled;
    export let onEditHandler : (stageIndex : number, handlerIndex : number) => void = (i, j) => {};

    export let handlerIndex : number; 

    let defaultColor = disabledColor;
    let hoverColor = disabledColor;

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

    function onOptionSelected(index : number) : void {
        handlerIndex = index;
        onEditHandler(stageIndex, handlerIndex);
    }

    function onButtonHoverStart() {
        buttonColor = hoverColor;
    }
    function onButtonHoverEnd() {
        buttonColor = defaultColor;
    }
</script>

<div class="flex items-center" style="margin-top:3px">
    <!--Button-->
    <!-- svelte-ignore a11y-no-static-element-interactions svelte-ignore a11y-click-events-have-key-events -->
    <div class="p-2 rounded-full" 
        style="width: {buttonSize}px; height: {buttonSize}px; background-color: {buttonColor}; margin: 0px {radius}px 0px {radius}px;
        cursor: {buttonType != ButtonType.Disabled ? 'pointer' : 'auto'};"
        on:mouseenter={onButtonHoverStart} on:mouseleave={onButtonHoverEnd} on:click={onButtonClick}></div>
    
    <!--Renamable Input-->
    {#if isRenamable && buttonType != ButtonType.Add}
        <input class="p-2 flex-grow" 
            style="height: {height}px; background-color:{renamableColor}; border:none; outline-style:none;"
            value="{stageName}"/>
    <!--Add-->
    {:else if buttonType == ButtonType.Add}
        <!-- svelte-ignore a11y-click-events-have-key-events svelte-ignore a11y-no-static-element-interactions -->
        <div class="p-2 cursor-pointer flex-grow" 
            style = "height: {height}px; background-color:{buttonColor}; border:none; outline-style:none; border-bottom-right-radius: 6px;" 
            on:mouseenter={onButtonHoverStart} on:mouseleave={onButtonHoverEnd} on:click={onButtonClick}
            >{stageName}</div>
    <!--Non Renamable, non-button-->
    {:else} 
        <!-- svelte-ignore a11y-click-events-have-key-events svelte-ignore a11y-no-static-element-interactions -->
        <div class="p-2 flex-grow" 
            style = "height: {height}px; background-color:{subBGColor}; border:none; outline-style:none;"
            >{stageName}</div>
    {/if}

    <!--Dropdown-->
    {#if buttonType != ButtonType.Add}
        <DropdownButton handlerIndex={handlerIndex} onOptionSelected={onOptionSelected} users={users} isLast={isLast}/>
    {/if}
</div>

<style>
    input:focus {
        outline-style: none;
        border:none;
    }
</style>