<script lang="ts">
    export let indentLevel = 0;
    export let height = 40;
    export let buttonSize = height / 2;
    export let stageName = "I'm a Stage";

    let radius = buttonSize / 2;

    const greenDefault = "#7bedbc";
    const greenHover = "#49d180";
    const redDefault = "#db2a4d";
    const redHover = "red-300";
    const grayDefault = "#dadfe0";
    const grayHover = "#909599";

    //todo: this will be handled automatically based on some bools or enums
    export let leftColor = redDefault;
    let rightColor = grayDefault;
</script>

<div class="flex items-center" style="margin: 3px {indentLevel * buttonSize}px; 0px 0px">
    <div class="p-2 cursor-pointer rounded-full" 
        style="width: {buttonSize}px; height: {buttonSize}px; background-color: {leftColor}; margin: 0px {radius}px 0px {radius}px;"></div>
    
    <input class="p-2 cursor-pointer flex-grow" 
        style="height: {height}px; background-color:{rightColor}; border:none; outline-style:none;"
        value="{stageName}" />
</div>

<style>
    input:focus {
        outline-style: none;
        border:none;
        background-color: yellow;
    }
</style>