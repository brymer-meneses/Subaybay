<script lang="ts">
    import Dropdown from "./dropdown.svelte";
    import { UserData } from "./configConstants";
    import { onMount } from "svelte";
    
    export let onOptionSelected : (index : number) => void;
    export let handlerIndex : number;
    export let users : UserData[];

    let imgSrc = users[handlerIndex].imgSrc;
    let handlerName = users[handlerIndex].name;
    
    let dropdownButton : any;
    let rect : any;
    let isOpen : boolean;

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
        // recalculate position if being opened 
        if(!isOpen == true) rect = dropdownButton.getBoundingClientRect();
        isOpen = !isOpen;
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events svelte-ignore a11y-no-static-element-interactions -->
<div bind:this={dropdownButton} class="cursor-pointer p-1" 
    on:click={toggleDropdown}>
    <img src={imgSrc} alt="{handlerName}" 
        class="rounded-full flex"/>    
</div>

{#if rect} <!--dropdownButton is null until mounting-->
    <Dropdown bind:isOpen={isOpen}
        top={rect.top} left={rect.left} 
        users={users} onOptionSelected={onSelected} userIndex={handlerIndex}
    />
{/if}
