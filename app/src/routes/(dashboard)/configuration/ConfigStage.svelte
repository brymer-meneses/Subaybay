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

  export let users: { [key: string]: UserData };
  export let handlerOptions: UserData[];
  export let handlerId: string;

  export let isDeletable = true;
  export let isRenamable = true;
  export let stageTitle = "";
  export let stageIndex: number;

  export let deleteFunction = (stageIndex: number) => {};
  export let onHandlerEdited: (stageIndex: number, handlerId: string) => void;

  function onDropdownChanged(value: string | undefined) {
    if (!value) value = "";

    handlerId = value;
    onHandlerEdited(stageIndex, handlerId);
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
    bind:value={stageTitle}
    disabled={!isRenamable}
  />

  <DropDownMenu.Root>
    <DropDownMenu.Trigger>
      <div class="ml-2">
        {#if !(handlerId in users) || users[handlerId].profileUrl === ""}
          <CircleUserRound class="h-8 w-8 stroke-muted-foreground stroke-1" />
        {:else}
          <Avatar.Root class="h-8 w-8">
            <Avatar.Image
              src={users[handlerId].profileUrl}
              alt={users[handlerId].name}
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
          value={handlerId}
          onValueChange={onDropdownChanged}
        >
          {#each handlerOptions as user}
            <DropDownMenu.RadioItem value={user.id}>
              {user.name}
            </DropDownMenu.RadioItem>
          {/each}
        </DropDownMenu.RadioGroup>
        <Scrollbar orientation="vertical" />
      </ScrollArea>
    </DropDownMenu.Content>
  </DropDownMenu.Root>
</div>
