<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import * as HoverCard from "$lib/components/ui/hover-card/index.js";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
  import { Button } from "$lib/components/ui/button/index.js";

  import UsersRoundCog from "lucide-svelte/icons/user-round-cog";

  export let users: User[];
  export let tab: string;

  let value: string = "users";

  const onClickHandler = (value: string) => {
    tab = value;
  };
</script>

<Card.Root class="m-0 h-full w-72">
  <Card.Header>
    <Card.Title>Users</Card.Title>
  </Card.Header>
  <Card.Content>
    <ScrollArea class="h-[500px] w-full rounded-md">
      {#each users as user}
        <div class="mb-4 flex items-center justify-between space-x-4">
          <div class="flex items-center space-x-4">
            <img
              src={user.profileUrl}
              alt=""
              class="aspect-square h-12 rounded-full"
            />
            <div>
              <p class="text-sm font-medium leading-none">
                {user.name.length > 20
                  ? user.name.substring(0, 20) + "..."
                  : user.name}
                {#if user.isAdmin}
                  <HoverCard.Root>
                    <HoverCard.Trigger>
                      <UsersRoundCog class="inline h-4 w-4 opacity-60" />
                    </HoverCard.Trigger>
                    <HoverCard.Content
                      class="w-20 p-2 text-center text-sm font-semibold"
                      >Admin</HoverCard.Content
                    >
                  </HoverCard.Root>
                {/if}
              </p>
              <p class="text-sm text-muted-foreground">
                {user.email.length > 25
                  ? user.email.substring(0, 25) + "..."
                  : user.email}
              </p>
            </div>
          </div>
        </div>
      {/each}
    </ScrollArea>
  </Card.Content>
  <Card.Footer class="float-end">
    <Button class="w-28 gap-1" on:click={() => onClickHandler(value)}
      >Manage</Button
    >
  </Card.Footer>
</Card.Root>
