<script lang="ts">
    export let index : number = -1;
    export let name : string;
    export let imgUrl = "";
    export let onSelect : (i : number) => void = (i) => {};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events svelte-ignore a11y-click-events-have-key-events svelte-ignore a11y-no-static-element-interactions -->
<div class="cursor-pointer flex" style=" margin-top: 3px;"
     on:click={ () => {onSelect(index)} }>
    <div class="p-1" >
        <img src="{imgUrl}" alt="{name}" class="rounded-full flex"/>
    </div>
    <div class="flex items-center" style=" margin-left: 5px;">
        {name}
    </div>
</div>