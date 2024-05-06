<script lang="ts">
  import { Input } from "$lib/components/ui/input";
  import { Button } from "$lib/components/ui/button";
  import { UserData } from "./configClasses";
  import * as Avatar from "$lib/components/ui/avatar/index";
  import * as DropDownMenu from "$lib/components/ui/dropdown-menu/index";

  import { ScrollArea, Scrollbar } from "$lib/components/ui/scroll-area";

  import CircleUserRound from "lucide-svelte/icons/circle-user-round";
  import Ban from "lucide-svelte/icons/ban";
  import CircleX from "lucide-svelte/icons/circle-x";

  export let users: UserData[];
  export let handlerIndex: number;

  export let isDeletable = true;
  export let isRenamable = true;
  export let substageName = "";
  export let stageIndex: number;

  export let deleteFunction = (substageIndex: number) => {};
  export let onHandlerEdited: (
    substageIndex: number,
    handlerIndex: number,
  ) => void = (i, j) => {};

  function onDropdownChanged(value: string | undefined) {
    if (value) {
      handlerIndex = parseInt(value);
      onHandlerEdited(stageIndex, handlerIndex);
    }
  }
</script>

<div class="flex flex-row gap-2">
  <Button
    variant="ghost"
    disabled={!isDeletable}
    on:click={() => deleteFunction(stageIndex)}
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

  <DropDownMenu.Root>
    <DropDownMenu.Trigger>
      <div class="ml-2">
        {#if users[handlerIndex].profileUrl === ""}
          <CircleUserRound class="h-8 w-8 stroke-muted-foreground stroke-1" />
        {:else}
          <Avatar.Root class="h-8 w-8">
            <Avatar.Image
              src={users[handlerIndex].profileUrl}
              alt={users[handlerIndex].name}
            />
          </Avatar.Root>
        {/if}
      </div>
    </DropDownMenu.Trigger>
    <DropDownMenu.Content>
      <DropDownMenu.Label>Default Handler</DropDownMenu.Label>

      <DropDownMenu.Separator />

      <ScrollArea class="h-[150px]">
        <DropDownMenu.RadioGroup
          value={handlerIndex.toString()}
          onValueChange={onDropdownChanged}
        >
          {#each users as user, index}
            <DropDownMenu.RadioItem value={index.toString()}>
              {user.name}
            </DropDownMenu.RadioItem>
          {/each}
        </DropDownMenu.RadioGroup>
        <Scrollbar orientation="vertical" />
      </ScrollArea>
    </DropDownMenu.Content>
  </DropDownMenu.Root>
</div>
