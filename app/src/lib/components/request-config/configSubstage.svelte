<script lang="ts">
    import { Input } from "$lib/components/ui/input";
    import { Avatar, AvatarFallback, AvatarImage } from "$lib/components/ui/avatar"
    import { Button } from "$lib/components/ui/button";
    import { UserData } from "./configConstants";
    import {
        DropdownMenu,
        DropdownMenuContent,
        DropdownMenuLabel,
        DropdownMenuRadioGroup,
        DropdownMenuRadioItem,
        DropdownMenuSeparator,
        DropdownMenuTrigger,
    } from "$lib/components/ui/dropdown-menu"
   
    export let users : UserData[];
    export let handlerIndex : number; 
    let handlerIndexStr = handlerIndex.toString(); //todo: figure out a better solution

    export let isDeletable = true;
    export let isRenamable = true;
    export let substageName = "";
    export let substageIndex : number;
    
    export let deleteFunction = (substageIndex : number) => {};
    export let onHandlerEdited : (substageIndex : number, handlerIndex : number) => void = (i, j) => {};

    function onDropdownChanged() {
        handlerIndex = parseInt(handlerIndexStr);
        onHandlerEdited(substageIndex, handlerIndex);
    }
</script>

<div class="grid grid-cols-subgrid col-span-10">

    <Button class="col-span-1" variant="ghost" disabled={!isDeletable} on:click={() => deleteFunction(substageIndex)}>
        {#if isDeletable}
            <!--X-->
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.877075 7.49988C0.877075 3.84219 3.84222 0.877045 7.49991 0.877045C11.1576 0.877045 14.1227 3.84219 14.1227 7.49988C14.1227 11.1575 11.1576 14.1227 7.49991 14.1227C3.84222 14.1227 0.877075 11.1575 0.877075 7.49988ZM7.49991 1.82704C4.36689 1.82704 1.82708 4.36686 1.82708 7.49988C1.82708 10.6329 4.36689 13.1727 7.49991 13.1727C10.6329 13.1727 13.1727 10.6329 13.1727 7.49988C13.1727 4.36686 10.6329 1.82704 7.49991 1.82704ZM9.85358 5.14644C10.0488 5.3417 10.0488 5.65829 9.85358 5.85355L8.20713 7.49999L9.85358 9.14644C10.0488 9.3417 10.0488 9.65829 9.85358 9.85355C9.65832 10.0488 9.34173 10.0488 9.14647 9.85355L7.50002 8.2071L5.85358 9.85355C5.65832 10.0488 5.34173 10.0488 5.14647 9.85355C4.95121 9.65829 4.95121 9.3417 5.14647 9.14644L6.79292 7.49999L5.14647 5.85355C4.95121 5.65829 4.95121 5.3417 5.14647 5.14644C5.34173 4.95118 5.65832 4.95118 5.85358 5.14644L7.50002 6.79289L9.14647 5.14644C9.34173 4.95118 9.65832 4.95118 9.85358 5.14644Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
        {:else}  
            <!--No-->          
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.49991 0.877075C3.84222 0.877075 0.877075 3.84222 0.877075 7.49991C0.877075 11.1576 3.84222 14.1227 7.49991 14.1227C11.1576 14.1227 14.1227 11.1576 14.1227 7.49991C14.1227 3.84222 11.1576 0.877075 7.49991 0.877075ZM3.85768 3.15057C4.84311 2.32448 6.11342 1.82708 7.49991 1.82708C10.6329 1.82708 13.1727 4.36689 13.1727 7.49991C13.1727 8.88638 12.6753 10.1567 11.8492 11.1421L3.85768 3.15057ZM3.15057 3.85768C2.32448 4.84311 1.82708 6.11342 1.82708 7.49991C1.82708 10.6329 4.36689 13.1727 7.49991 13.1727C8.88638 13.1727 10.1567 12.6753 11.1421 11.8492L3.15057 3.85768Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
        {/if}
    </Button>

    <Input class="col-span-8" placeholder="Stage Name (Click to Name)" bind:value={substageName} disabled={!isRenamable}/>
    
    <!--! Doesn't work-->
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button class="col-span-1" variant="ghost">
                <Avatar>
                    <AvatarImage src="https://www.mobafire.com/images/champion/square/smolder.png" alt="" />
                </Avatar>
            </Button>
        </DropdownMenuTrigger>
            <DropdownMenuContent class="w-56">
            <DropdownMenuLabel>Default Handler</DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuRadioGroup value={"0"} onValueChange={onDropdownChanged}>
                <DropdownMenuRadioItem value={"0"}>{"Smolder's Mom"}</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value={"2"}>{"Smolder"}</DropdownMenuRadioItem>
                {#each users as user, index}
                    <DropdownMenuRadioItem value={index.toString()}>{user.name}</DropdownMenuRadioItem>
                {/each}
            </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
</div>

<!--Dropdown-->
<!-- {#if buttonType != ButtonType.Add}
    <DropdownButton handlerIndex={handlerIndex} onOptionSelected={onOptionSelected} users={users}/>
{/if} -->