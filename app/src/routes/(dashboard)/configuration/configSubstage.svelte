<script lang="ts">
  import { Input } from "$lib/components/ui/input";
  import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "$lib/components/ui/avatar";
  import { Button } from "$lib/components/ui/button";
  import { UserData } from "./configClasses";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "$lib/components/ui/dropdown-menu";

  import { ScrollArea, Scrollbar } from "$lib/components/ui/scroll-area";

  import CircleUserRound from "lucide-svelte/icons/circle-user-round";
  import Ban from "lucide-svelte/icons/ban";
  import CircleX from "lucide-svelte/icons/circle-x";

  export let users: UserData[];
  export let handlerIndex: number;

  export let isDeletable = true;
  export let isRenamable = true;
  export let substageName = "";
  export let substageIndex: number;

  export let deleteFunction = (substageIndex: number) => {};
  export let onHandlerEdited: (
    substageIndex: number,
    handlerIndex: number,
  ) => void = (i, j) => {};

  function onDropdownChanged(value: string | undefined) {
    if (value) {
      handlerIndex = parseInt(value);
      onHandlerEdited(substageIndex, handlerIndex);
    }
  }
</script>

<div class="flex flex-row gap-2">
  <Button
    variant="ghost"
    disabled={!isDeletable}
    on:click={() => deleteFunction(substageIndex)}
  >
    {#if isDeletable}
      <CircleX class="stroke-muted-foreground stroke-1" />
    {:else}
      <Ban class="stroke-muted-foreground stroke-1" />
    {/if}
  </Button>

  <Input
    placeholder="Stage Name (Click to Name)"
    bind:value={substageName}
    disabled={!isRenamable}
  />

  <DropdownMenu>
    <DropdownMenuTrigger>
      <div class="ml-2">
        {#if users[handlerIndex].profileUrl === ""}
          <CircleUserRound class="h-8 w-8 stroke-muted-foreground stroke-1" />
        {:else}
          <Avatar class="h-8 w-8">
            <AvatarImage
              src={users[handlerIndex].profileUrl}
              alt={users[handlerIndex].name}
            />
          </Avatar>
        {/if}
      </div>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>Default Handler</DropdownMenuLabel>

      <DropdownMenuSeparator />

      <ScrollArea class="h-[150px]">
        <DropdownMenuRadioGroup
          value={handlerIndex.toString()}
          onValueChange={onDropdownChanged}
        >
          {#each users as user, index}
            <DropdownMenuRadioItem value={index.toString()}>
              {user.name}
            </DropdownMenuRadioItem>
          {/each}
        </DropdownMenuRadioGroup>
        <Scrollbar orientation="vertical" />
      </ScrollArea>
    </DropdownMenuContent>
  </DropdownMenu>
</div>
