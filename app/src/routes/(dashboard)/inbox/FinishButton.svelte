<script lang="ts">
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "$lib/components/ui/dropdown-menu";
  import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "$lib/components/ui/avatar";
  import { ScrollArea, Scrollbar } from "$lib/components/ui/scroll-area";
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "$lib/components/ui/popover";
  import { Button } from "$lib/components/ui/button";

  import CheckCheck from "lucide-svelte/icons/check-check";
  import CircleUserRound from "lucide-svelte/icons/circle-user-round";

  export let selectedStage;
  export let users;
  export let processing: boolean;

  export let nextHandlerId: string = selectedStage.nextHandlerId;

  $: popoverOpen = processing;

  function onPopoverOpenChange(value: boolean) {
    popoverOpen = value && !processing;
  }
</script>

<Popover open={popoverOpen && !processing} onOpenChange={onPopoverOpenChange}>
  <PopoverTrigger>
    <Button class="gap-2 rounded-md">
      <CheckCheck />Finish
    </Button>
  </PopoverTrigger>
  <PopoverContent>
    <div class="flex flex-col justify-center gap-4">
      <div>Select Next Handler</div>
      <div class="flex flex-col">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div
              class="flex flex-row items-center gap-x-4 rounded-lg border border-gray-300 p-1"
            >
              {#if !(nextHandlerId in users)}
                <CircleUserRound
                  class="h-8 w-8 stroke-muted-foreground stroke-1"
                />
              {:else}
                <Avatar class="h-8 w-8">
                  <AvatarImage
                    src={users[nextHandlerId].profileUrl}
                    alt={users[nextHandlerId].name}
                  />
                </Avatar>
              {/if}
              {#if !(nextHandlerId in users)}
                None
              {:else}
                {users[nextHandlerId].name}
              {/if}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Send to</DropdownMenuLabel>

            <DropdownMenuSeparator />
            <ScrollArea class="h-[150px]">
              <DropdownMenuRadioGroup bind:value={nextHandlerId}>
                {#each Object.keys(users) as userId}
                  <DropdownMenuRadioItem value={userId}>
                    {users[userId].name}
                  </DropdownMenuRadioItem>
                {/each}
              </DropdownMenuRadioGroup>
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div class="padding-y-4 items-center">
        <slot></slot>
      </div>
    </div>
  </PopoverContent>
</Popover>
