<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import Plus from "lucide-svelte/icons/plus";

  export let users: {
    name: string;
    email: string;
    profileUrl: string;
    isAdmin: boolean;
  }[];
  export let admin: boolean;

  if (admin) {
    users = users.filter((e) => e.isAdmin);
  }
</script>

<Card.Root class="h-80 w-80">
  <Card.Header>
    <Card.Title>{admin ? "Administrators" : "Whitelisted Users"}</Card.Title>
  </Card.Header>
  <Card.Content>
    <ScrollArea class="h-44 w-full rounded-md ">
      {#each users as user}
        <div class="mb-4 flex items-center justify-between space-x-4">
          <div class="flex items-center space-x-4">
            <img
              src={user.profileUrl}
              alt=""
              class="aspect-square h-12 rounded-full border border-black"
            />
            <div>
              <p class="text-sm font-medium leading-none">
                {user.name.length > 25
                  ? user.name.substring(0, 25) + "..."
                  : user.name}
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
    <Button class="w-36 gap-1 pl-2"
      ><Plus size="20" /> {admin ? "Add Admin" : "Whitelist"}</Button
    >
  </Card.Footer>
</Card.Root>
