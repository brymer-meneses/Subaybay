<script lang="ts">
    import {disabledColor, subBGColor, deleteColor, deleteHoverColor, addColor, addHoverColor} from "./configConstants";
    import {height, radius, buttonSize} from "./configConstants";
    import {ButtonType} from "./configConstants";

    export let isRenamable = true;
    export let isLast = false;
    export let stageName = "Stage Name";
    
    export let onClick = () => {};
    export let buttonType : ButtonType = ButtonType.Disabled;

    let defaultColor = disabledColor;
    let hoverColor = disabledColor;
    let bgColor = subBGColor;

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
            bgColor = addColor;
            break;
    }

    $: buttonColor = defaultColor;

    function onButtonHoverStart() {
        buttonColor = hoverColor;
    }
    function onButtonHoverEnd() {
        buttonColor = defaultColor;
    }
</script>

<div class="flex items-center" style="margin-top:3px">
    <!-- svelte-ignore a11y-no-static-element-interactions svelte-ignore a11y-click-events-have-key-events -->
    <div class="p-2 cursor-pointer rounded-full" 
        style="width: {buttonSize}px; height: {buttonSize}px; background-color: {buttonColor}; margin: 0px {radius}px 0px {radius}px;"
        on:mouseenter={onButtonHoverStart} on:mouseleave={onButtonHoverEnd} on:click={onClick}></div>
    
    {#if isRenamable && buttonType != ButtonType.Add}
        <input class="p-2 cursor-pointer flex-grow" 
            style="height: {height}px; background-color:{bgColor}; border:none; outline-style:none;"
            value="{stageName}" />
    {:else}
        <!-- svelte-ignore a11y-click-events-have-key-events svelte-ignore a11y-no-static-element-interactions -->
        <div class="p-2 cursor-pointer flex-grow" 
            style="height: {height}px; background-color:{bgColor}; border:none; outline-style:none;" on:click={onClick}
            >{stageName}</div>
    {/if}

    <!--todo Show profile pic of Default Handler-->
    <!--<a href="https://www.vecteezy.com/free-vector/default-profile-picture">Default Profile Picture Vectors by Vecteezy</a>-->
    <!--todo Dropdown if clicked-->
    {#if buttonType != ButtonType.Add}
        <div class="cursor-pointer p-1" 
            style="width: {height}px; height: {height}px; background-color:{bgColor}; margin-left:3px;
                border-bottom-right-radius: {isLast ? '6px' : '0px'}">
            <img src="https://www.mobafire.com/images/champion/square/yuumi.png" alt="Default Handler" 
                class="rounded-full flex"/>    
        </div>
    {/if}
</div>

<style>
    input:focus {
        outline-style: none;
        border:none;
    }
</style>