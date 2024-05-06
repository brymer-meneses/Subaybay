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

  let nextHandlerId: string = selectedStage.nextHandlerId;
</script>

<Popover>
  <PopoverTrigger>
    <Button class="gap-2 rounded-xl text-white">
      <CheckCheck />Finish
    </Button>
  </PopoverTrigger>
  <PopoverContent>
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div class="ml-2 items-center">
            Click Here
            <CircleUserRound class="stroke-muted-foreground h-8 w-8 stroke-1" />
          </div>
        <!-- {#if users[nextHandlerId].profileUrl === ""}
          <CircleUserRound class="stroke-muted-foreground h-8 w-8 stroke-1" />
        {:else}
          <Avatar class="h-8 w-8">
            <AvatarImage
              src={users[nextHandlerId].profileUrl}
              alt={users[nextHandlerId].name}
            />
          </Avatar>
        {/if} -->
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Send to</DropdownMenuLabel>

        <DropdownMenuSeparator />
        <ScrollArea class="h-[150px]">
            <DropdownMenuRadioGroup value={nextHandlerId}>
            {#each Object.keys(users) as userId}
                <DropdownMenuRadioItem value={userId}>
                {users[userId].name}
                </DropdownMenuRadioItem>
            {/each}
            </DropdownMenuRadioGroup>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  </PopoverContent>
</Popover>

<!-- <form action="?/finish_stage" method="POST">
    <input
      type="hidden"
      name="requestId"
      value={selectedStage.requestId}
    />
    <input
      type="hidden"
      name="stageTypeIndex"
      value={selectedStage.stageTypeIndex}
    />
    <input type="hidden" name="nextHandlerId" value={nextHandlerId} />
    <button type="submit" class="border-none bg-none">Confirm</button>
  </form> -->
