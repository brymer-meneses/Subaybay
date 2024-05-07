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
    <div class="flex flex-col justify-center gap-4">
      <div>Select Next Handler</div>
      <div class="flex flex-col">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div
              class="flex flex-row gap-x-4 rounded-lg border border-gray-300 p-1"
            >
              {#if !(nextHandlerId in users)}
                <CircleUserRound
                  class="stroke-muted-foreground h-8 w-8 stroke-1"
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
        <form action="?/finish_stage" method="POST">
          <!--Todo use enhance?-->
            <input
              type="hidden"
              name="requestId"
              value={selectedStage.requestId}
            />
            <input type="hidden" name="nextHandlerId" value={nextHandlerId} />
            <Button type="submit" disabled={nextHandlerId in users ? false : true}>Confirm</Button>
          </form>
      </div>
    </div>
  </PopoverContent>
</Popover>
