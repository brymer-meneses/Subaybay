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
      <Table.Head class=" ">Name</Table.Head>
      <Table.Head class=" ">Email</Table.Head>
      <Table.Head class=" ">ID</Table.Head>
      <Table.Head class=" ">Roles</Table.Head>
      <Table.Head class=" text-center ">Admin</Table.Head>
      <Table.Head class=" text-center">Remove</Table.Head>
    </Table.Row>
  </Table.Header>
  <ScrollArea class="h-[30rem]">
    <Table.Body>
      {#each users as user (user._id)}
        <Table.Row class="grid w-full grid-cols-6 text-left">
          <Table.Cell>{user.name}</Table.Cell>
          <Table.Cell>{user.email}</Table.Cell>
          <Table.Cell>{user._id}</Table.Cell>
          <Table.Cell>
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
</Table.Root>
