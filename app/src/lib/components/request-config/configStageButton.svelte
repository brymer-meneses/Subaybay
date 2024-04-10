<script lang="ts">
    import { onMount } from "svelte";
    import { disabledColor, deleteColor, deleteHoverColor, addColor, addHoverColor, renamableColor, subBGColor } from "./configConstants";
    import { height, radius, buttonSize } from "./configConstants";
    import { ButtonType, UserData } from "./configConstants";
    import Dropdown from "./dropdown.svelte";
    
    export let users : UserData[];

    export let isRenamable = true;
    export let isLast = false;
    export let stageName = "Stage Name";
    
    export let onClick = () => {};
    export let buttonType : ButtonType = ButtonType.Disabled;

    export let userIndex : number = 0;
    let imgSrc = users[userIndex].imgSrc;
    let handler = users[userIndex].name;

    let dropdownOpen = false;
    let base : any, rect : any;

    onMount(async () => {
        rect = base.getBoundingClientRect();
    });

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
        userIndex = index;
        imgSrc = users[index].imgSrc;
    }

    function onButtonHoverStart() {
        buttonColor = hoverColor;
    }
    function onButtonHoverEnd() {
        buttonColor = defaultColor;
    }
    function toggleDropdown() {
        dropdownOpen = !dropdownOpen;
    }
</script>

<div bind:this={base} class="flex items-center" style="margin-top:3px">
    <!--Small Button-->
    <!-- svelte-ignore a11y-no-static-element-interactions svelte-ignore a11y-click-events-have-key-events -->
    <div class="p-2 cursor-pointer rounded-full" 
        style="width: {buttonSize}px; height: {buttonSize}px; background-color: {buttonColor}; margin: 0px {radius}px 0px {radius}px;"
        on:mouseenter={onButtonHoverStart} on:mouseleave={onButtonHoverEnd} on:click={onClick}></div>
    
    <!--Renamable Input-->
    {#if isRenamable && buttonType != ButtonType.Add}
        <input class="p-2 cursor-pointer flex-grow" 
            style="height: {height}px; background-color:{renamableColor}; border:none; outline-style:none;"
            value="{stageName}"/>
    <!--Add Button-->
    {:else if buttonType == ButtonType.Add}
        <!-- svelte-ignore a11y-click-events-have-key-events svelte-ignore a11y-no-static-element-interactions -->
        <div class="p-2 cursor-pointer flex-grow" 
            style = "height: {height}px; background-color:{buttonColor}; border:none; outline-style:none; border-bottom-right-radius: 6px;" 
            on:mouseenter={onButtonHoverStart} on:mouseleave={onButtonHoverEnd} on:click={onClick}
            >{stageName}</div>
    <!--Non Renamable, non-button-->
    {:else} 
        <!-- svelte-ignore a11y-click-events-have-key-events svelte-ignore a11y-no-static-element-interactions -->
        <div class="p-2 cursor-pointer flex-grow" 
            style = "height: {height}px; background-color:{subBGColor}; border:none; outline-style:none;"
            >{stageName}</div>
    {/if}

    <!--Dropdown-->
    {#if buttonType != ButtonType.Add}
        <!-- svelte-ignore a11y-click-events-have-key-events svelte-ignore a11y-no-static-element-interactions -->
        <div class="cursor-pointer p-1" 
            style="width: {height}px; height: {height}px; background-color:{subBGColor}; margin-left:3px;
                border-bottom-right-radius: {isLast ? '6px' : '0px'}"
            on:click={toggleDropdown}>
            <img src={imgSrc} alt="{handler}" 
                class="rounded-full flex"/>    
        </div>
        
        {#if base}
            <Dropdown bind:isOpen={dropdownOpen} 
                top={rect.top} left={rect.left + rect.width - height} 
                users={users} onOptionSelected={onOptionSelected} userIndex={userIndex}
            />
        {/if}
    {/if}
</div>

<style>
    input:focus {
        outline-style: none;
        border:none;
    }
</style>