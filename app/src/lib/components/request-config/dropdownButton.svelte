<script lang="ts">
    import Dropdown from "./dropdown.svelte";
    import { height } from "./configConstants";
    import { subBGColor, subBGHoverColor } from "./configConstants";
    import { UserData } from "./configConstants";
    import { onMount } from "svelte";
    
    export let onOptionSelected : (index : number) => void;
    export let isLast : boolean;
    export let handlerIndex : number;
    export let users : UserData[];

    let imgSrc = users[handlerIndex].imgSrc;
    let handlerName = users[handlerIndex].name;
    
    let dropdownButton : any;
    let rect : any;
    let isOpen : boolean;

    let bgColor = subBGColor;

    onMount(async () => {
        rect = dropdownButton.getBoundingClientRect();
    });

    function onSelected(index : number)
    {
        handlerName = users[index].name;
        imgSrc = users[index].imgSrc;
        onOptionSelected(index);
    }

    function toggleDropdown() {
        console.log(users.length);
        isOpen = !isOpen;
        console.log("HI");
    }

    function onHoverStart() {
        bgColor = subBGHoverColor;
    }

    function onHoverEnd() {
        bgColor = subBGColor;
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events svelte-ignore a11y-no-static-element-interactions -->
<div bind:this={dropdownButton} class="cursor-pointer p-1" 
    style="width: {height}px; height: {height}px; background-color:{bgColor}; margin-left:3px;
        border-bottom-right-radius: {isLast ? '6px' : '0px'}"
    on:click={toggleDropdown} on:mouseenter={onHoverStart} on:mouseleave={onHoverEnd}>
    <img src={imgSrc} alt="{handlerName}" 
        class="rounded-full flex"/>    
</div>

{#if rect} <!--dropdownButton is null until mounting-->
    <Dropdown bind:isOpen={isOpen}
        top={rect.top} left={rect.left} 
        users={users} onOptionSelected={onSelected} userIndex={handlerIndex}
    />
{/if}
