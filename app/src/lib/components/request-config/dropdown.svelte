<script lang="ts">
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
    <div class="dropdown border-black border-1 border shadow-lg"
        on:mouseleave={onHoverExit}>
        
        <!--Header-->
        <div class="flex" >
            <div class="p-1">
                <img src="{users[userIndex].imgSrc}" alt="{users[userIndex].name}" class="rounded-full flex"/>
            </div>
            <div class="flex-grow items-center" >
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
