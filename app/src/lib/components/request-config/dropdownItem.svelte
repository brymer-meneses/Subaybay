<script lang="ts">
    import {height} from "./configConstants";
    import {subBGColor, subBGHoverColor} from "./configConstants";

    export let index : number = -1;
    export let name : string;
    export let imgUrl = "";
    export let onSelect : (i : number) => void = (i) => {};

    let bgColor = subBGColor;

    function onHoverStart() {
        bgColor = subBGHoverColor;
    }

    function onHoverEnd() {
        bgColor = subBGColor;
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events svelte-ignore a11y-click-events-have-key-events svelte-ignore a11y-no-static-element-interactions -->
<div class="cursor-pointer flex" style="height: {height}px; background-color:{bgColor}; margin-top: 3px;"
    on:mouseenter={onHoverStart} on:mouseleave={onHoverEnd} on:click={ () => {onSelect(index)} }>
    <div class="p-1" style="width: {height}px; height: {height}px;">
        <img src="{imgUrl}" alt="{name}" class="rounded-full flex"/>
    </div>
    <div class="flex items-center" style="height:{height}; margin-left: 5px;">
        {name}
    </div>
</div>