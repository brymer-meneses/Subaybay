<script lang="ts">
  import * as DD from "$lib/components/ui/dropdown-menu";
  import * as Avatar from "$lib/components/ui/avatar";
  import { ScrollArea } from "$lib/components/ui/scroll-area";

  import type { User } from "$lib/server/database";

  import CircleUserRound from "lucide-svelte/icons/circle-user-round";

  export let users: { [key: string]: User };
  export let selectedUserId: string;
  export let title;
</script>

<div>{title}</div>
<div class="flex flex-col">
  <DD.DropdownMenu>
    <DD.DropdownMenuTrigger>
      <div
        class="flex flex-row items-center gap-x-4 rounded-lg border border-gray-300 p-1"
      >
        {#if !(selectedUserId in users)}
          <CircleUserRound class="stroke-muted-foreground h-8 w-8 stroke-1" />
        {:else}
          <Avatar.Avatar class="h-8 w-8">
            <Avatar.AvatarImage
              src={users[selectedUserId].profileUrl}
              alt={users[selectedUserId].name}
            />
          </Avatar.Avatar>
        {/if}
        {#if !(selectedUserId in users)}
          None
        {:else}
          {users[selectedUserId].name}
        {/if}
      </div>
    </DD.DropdownMenuTrigger>
    <DD.DropdownMenuContent>
      <DD.DropdownMenuLabel>Send to</DD.DropdownMenuLabel>

      <DD.DropdownMenuSeparator />
      <ScrollArea class="h-[150px]">
        <DD.DropdownMenuRadioGroup bind:value={selectedUserId}>
          {#each Object.keys(users) as userId}
            <DD.DropdownMenuRadioItem value={userId}>
              {users[userId].name}
            </DD.DropdownMenuRadioItem>
          {/each}
        </DD.DropdownMenuRadioGroup>
      </ScrollArea>
    </DD.DropdownMenuContent>
  </DD.DropdownMenu>
</div>
