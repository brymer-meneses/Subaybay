<script lang="ts">
  import * as Table from "$lib/components/ui/table";
  import * as Card from "$lib/components/ui/card/index.js";
  import Input from "$lib/components/ui/input/input.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { Switch } from "$lib/components/ui/switch/index.js";

  import UsersRoundCog from "lucide-svelte/icons/user-round-cog";
  import Plus from "lucide-svelte/icons/plus";
  import Search from "lucide-svelte/icons/search";

  type User = {
    _id: string;
    name: string;
    email: string;
    profileUrl: string;
    isAdmin: boolean;
  };

  export let users: User[];

  let searchTerm: string = "";
  let filteredUsers: User[] = [];

  $: filteredUsers = users.filter((user: User) => {
    for (const key in user) {
      if (key === "isAdmin" || key === "profileUrl") continue;
      const userKey = key as keyof User;
      if (
        String(user[userKey]).toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return user;
      }
    }
    return null;
  });
</script>

<Card.Root>
  <Card.Header class="flex w-full flex-row items-center space-y-0 align-middle">
    <div class="w-36">
      <Button><Plus size="20" />Add a User</Button>
    </div>
    <div class="relative w-80">
      <Search class="text-muted-foreground absolute left-2.5 top-2.5 h-4 w-4" />
      <Input
        type="search"
        placeholder="Search..."
        class="bg-background w-full rounded-lg pl-8"
        bind:value={searchTerm}
      />
    </div>
  </Card.Header>
  <Card.Content>
    <Table.Root>
      <Table.Caption
        >Returned {filteredUsers.length}
        {filteredUsers.length === 1 ? "result" : "results"}.</Table.Caption
      >
      <Table.Header>
        <Table.Row class="grid w-full grid-cols-5 text-left font-semibold">
          <Table.Cell class=" ">Name</Table.Cell>
          <Table.Cell class=" ">Email</Table.Cell>
          <Table.Cell class=" ">ID</Table.Cell>
          <Table.Cell class=" text-center ">Admin Privileges</Table.Cell>
          <Table.Cell class=" "></Table.Cell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {#each filteredUsers as user (user._id)}
          <Table.Row class="grid w-full grid-cols-5 text-left">
            <Table.Cell>
              <p>
                {user.name}{#if user.isAdmin}
                  <UsersRoundCog class="ml-4 inline h-4 w-4 opacity-60" />
                {/if}
              </p>
            </Table.Cell>
            <Table.Cell>
              <p>{user.email}</p>
            </Table.Cell>
            <Table.Cell>
              <p>{user._id}</p>
            </Table.Cell>
            <Table.Cell>
              <div class="flex justify-center">
                <Switch checked={user.isAdmin} />
              </div>
            </Table.Cell>
            <Table.Cell>
              <div class="flex justify-center">
                <Button variant="destructive">Remove</Button>
              </div>
            </Table.Cell>
          </Table.Row>
        {/each}
      </Table.Body>
    </Table.Root>
  </Card.Content>
</Card.Root>
