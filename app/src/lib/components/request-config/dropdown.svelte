<script lang="ts">
    import { height } from "./configConstants";
    import { headerColor, mainBGColor } from "./configConstants";
    import DropdownButton from "./dropdownItem.svelte";
    import { UserData } from "./configConstants";
    const width = 200;

    export let userIndex : number;

    export let isOpen = false;
    export let top : number = 0;
    export let left : number = 0;

    export let onOptionSelected : (index : number) => void;

    export let users : UserData[];

    export function toggleDropdown() {
        isOpen = !isOpen;
    }

    function select(index : number) {
        isOpen = false;
        onOptionSelected(index);
    }

    function onHoverExit() {
        isOpen = false;
    }
</script>

{#if isOpen}
    <!-- todo add scrollability -->
    <!-- svelte-ignore a11y-click-events-have-key-events svelte-ignore a11y-no-static-element-interactions svelte-ignore a11y-mouse-events-have-key-events -->
    <div class="dropdown border-black border-1 border"
        style="top: {top}px; left: {left}px; width: {width}px; background-color:{mainBGColor};"
        on:mouseleave={onHoverExit}>
        
        <!--Header-->
        <div class="flex" style="height: {height}px; background-color:{headerColor};">
            <div class="p-1" style="width: {height}px; height: {height}px;">
                <img src="{users[userIndex].imgSrc}" alt="{users[userIndex].name}" class="rounded-full flex"/>
            </div>
            <div class="flex-grow items-center" style="height:{height}; margin-left: 5px;">
                {users[userIndex].name}
            </div>
        </div>

        <div class="dropdown-options-container">
             <!--Options-->
            {#each users as option, index}
                <DropdownButton name = { option.name } imgUrl = { option.imgSrc } index={index} onSelect={select} />
            {/each}
        </div>
    </div>
{/if}

<style>
    .dropdown {
        position: absolute;
        z-index: 100;
        overflow: hidden;
        border-radius: 12px;
        border-top-left-radius: 0px;
    }
    .dropdown-options-container {
        overflow: auto;
        max-height: 200px;
    }
</style>
