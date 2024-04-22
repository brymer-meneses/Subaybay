<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import Plus from "lucide-svelte/icons/plus";
  import Minus from "lucide-svelte/icons/minus";

  type User = {
    name: string;
    email: string;
    profileUrl: string;
    isAdmin: boolean;
  };
  export let users: User[];
  let selectedUsers: User[] = [];

  function handleSelectUser(name: string, email: string) {
    const user = users.find((u) => u.name === name && u.email === email);
    if (user && !selectedUsers.some((u) => u.email === email)) {
      selectedUsers = [...selectedUsers, user];
    }
  }

  function handleUnselectUser(name: string, email: string) {
    selectedUsers = selectedUsers.filter((u) => u.email !== email);
  }
</script>

<Dialog.Root>
  <Dialog.Trigger>
    <Button class="gap-4 p-3"><Plus size="20" />Add an Admin</Button>
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Select Users (UI not final)</Dialog.Title>
      <Dialog.Description>
        Select user/s to be added as admin.
      </Dialog.Description>
    </Dialog.Header>
    <div class="grid gap-4 py-2">
      <ScrollArea class="max-h-80">
        {#each users as user (user.email)}
          <div class="mb-4 flex items-center justify-between space-x-4">
            <div class="flex items-center space-x-4">
              {#if !selectedUsers.some((u) => u.email === user.email)}
                <Button
                  variant="ghost"
                  on:click={() => handleSelectUser(user.name, user.email)}
                >
                  <Plus class="text-green-800" />
                </Button>
              {:else}
                <Button
                  variant="ghost"
                  on:click={() => handleUnselectUser(user.name, user.email)}
                >
                  <Minus class="text-red-800" />
                </Button>
              {/if}
              <img
                src={user.profileUrl}
                alt=""
                class="aspect-square h-12 rounded-full border border-black"
              />
              <div>
                <p class="text-sm font-medium leading-none">
                  {user.name}
                </p>
                <p class="text-muted-foreground text-sm">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        {/each}
      </ScrollArea>
    </div>
    <Separator />
    <Dialog.Footer>
      {#if selectedUsers.length}
        <Button class="gap-4 px-10"
          >{selectedUsers.length === 1 ? "Add User" : "Add Users"}</Button
        >
      {:else}
        <Button class="pointer-events-none gap-4 px-10 opacity-10"
          >Add User</Button
        >
      {/if}
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
