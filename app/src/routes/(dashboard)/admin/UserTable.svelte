<script lang="ts">
  import * as Table from "$lib/components/ui/table";

  import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte";
  import { Badge } from "$lib/components/ui/badge/index.js";

  import RemoveUserForm from "./RemoveUserForm.svelte";
  import RemoveAdminForm from "./RemoveAdminForm.svelte";
  import AddAdminForm from "./AddAdminForm.svelte";

  type User = {
    _id: string;
    name: string;
    email: string;
    profileUrl: string;
    isAdmin: boolean;
  };
  export let users: User[];
</script>

<Table.Root class="mt-4">
  <Table.Caption
    >Returned {users.length}
    {users.length === 1 ? "result" : "results"}.</Table.Caption
  >
  <Table.Header>
    <Table.Row class="grid w-full grid-cols-6 text-left">
      <Table.Head class="col-span-2 ">User</Table.Head>
      <!-- <Table.Head class=" ">Email</Table.Head>
      <Table.Head class=" ">ID</Table.Head> -->
      <Table.Head class="col-span-2 ">Roles</Table.Head>
      <Table.Head class="col-span-2 text-center ">Actions</Table.Head>
      <!-- <Table.Head class=" text-center">Remove</Table.Head> -->
    </Table.Row>
  </Table.Header>
  {#if users.length > 0}
    <ScrollArea class="h-[30rem]">
      <Table.Body>
        {#each users as user (user._id)}
          <Table.Row class="grid w-full grid-cols-6 text-left">
            <Table.Cell class="col-span-2">
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
                      <span class="text-muted-foreground font-normal">
                        ({user._id})</span
                      >
                    </p>
                    <p class="text-muted-foreground text-sm">
                      {user.email.length > 25
                        ? user.email.substring(0, 25) + "..."
                        : user.email}
                    </p>
                  </div>
                </div>
              </div>
            </Table.Cell>
            <Table.Cell class="col-span-2">
              {#if user.isAdmin}
                <Badge>Admin</Badge>
              {/if}
              <Badge variant="outline">Staff</Badge>
            </Table.Cell>
            <Table.Cell class="flex justify-center">
              {#if user.isAdmin}
                <RemoveAdminForm {user} />
              {:else}
                <AddAdminForm {user} />
              {/if}
            </Table.Cell>
            <Table.Cell class="flex justify-center">
              <RemoveUserForm {user} />
            </Table.Cell>
          </Table.Row>
        {/each}
      </Table.Body>
    </ScrollArea>
  {/if}
</Table.Root>
