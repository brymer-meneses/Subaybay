<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import Input from "$lib/components/ui/input/input.svelte";

  import Search from "lucide-svelte/icons/search";

  import UserTable from "./UserTable.svelte";
  import AddUser from "./AddUser.svelte";
  import type { PageServerData } from "./$types";

  export let users: User[];
  export let data: PageServerData;

  let searchTerm: string = "";
  let filteredUsers: User[] = [];

  $: {
    filteredUsers = users.filter((user: User) => {
      for (const key in user) {
        if (key === "isAdmin" || key === "profileUrl") continue;
        const userKey = key as keyof User;
        if (
          String(user[userKey])
            .toLowerCase()
            .includes(searchTerm.trim().toLowerCase())
        ) {
          return user;
        }
      }
      return null;
    });
  }
</script>

<Card.Root>
  <Card.Header
    class="flex flex-col align-middle md:flex-row md:items-center md:justify-between"
  >
    <Card.Title class="text-xl font-bold">User Management</Card.Title>
    <div class="flex flex-row items-center space-x-4 space-y-0 align-middle">
      <div class="relative w-80">
        <Search
          class="text-muted-foreground absolute left-2.5 top-2.5 h-4 w-4"
        />
        <Input
          type="search"
          placeholder="Search User"
          class="bg-background w-full rounded-lg pl-8"
          bind:value={searchTerm}
        />
      </div>
      <div class="w-36">
        <AddUser data={data.form} />
      </div>
    </div>
  </Card.Header>
  <Card.Content>
    <UserTable bind:users={filteredUsers} />
  </Card.Content>
</Card.Root>
