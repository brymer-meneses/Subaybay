<script lang="ts">
  import { page } from "$app/stores";
  import * as Table from "$lib/components/ui/table";
  import { Pencil } from "lucide-svelte";

  import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte";
  import { Badge } from "$lib/components/ui/badge/index.js";

  import RemoveUserForm from "./RemoveUserForm.svelte";
  import RemoveAdminForm from "./RemoveAdminForm.svelte";
  import AddAdminForm from "./AddAdminForm.svelte";

  export let users: User[];
</script>

<Table.Root class="mt-4">
  <Table.Caption
    >Showing {users.length}
    {users.length === 1 ? "result" : "results"}.</Table.Caption
  >
  <Table.Header>
    <Table.Row class="grid w-full grid-cols-8 text-left">
      <Table.Head class="col-span-2 ">User</Table.Head>
      <Table.Head class="col-span-2 ">Roles</Table.Head>
      <Table.Head class="col-span-2 ">Nickname</Table.Head>
      <Table.Head class="col-span-2 text-center ">Actions</Table.Head>
    </Table.Row>
  </Table.Header>
  <ScrollArea class="h-[28rem]">
    <Table.Body>
      {#each users as user (user._id)}
        <Table.Row class="grid w-full grid-cols-8 text-left">
          <Table.Cell class="col-span-2 content-center">
            <div class="mb-4 flex items-center justify-between space-x-4">
              <div class="flex items-center lg:space-x-4">
                <img
                  src={user.profileUrl}
                  alt=""
                  class="hidden aspect-square h-12 rounded-full lg:block"
                />
                <div>
                  <p class="text-sm font-medium leading-none">
                    {user.name.length > 20
                      ? user.name.substring(0, 20) + "..."
                      : user.name}
                    <span
                      class="text-muted-foreground hidden font-normal lg:block xl:inline"
                    >
                      ({user._id})
                    </span>
                  </p>
                  <p
                    class="text-muted-foreground hidden text-sm lg:block xl:inline"
                  >
                    {user.email.length > 25
                      ? user.email.substring(0, 25) + "..."
                      : user.email}
                  </p>
                </div>
              </div>
            </div>
          </Table.Cell>
          <Table.Cell class="col-span-2 content-center">
            {#if user.isAdmin}
              <Badge>Admin</Badge>
            {/if}
            <Badge variant="outline">Staff</Badge>
          </Table.Cell>
          <Table.Cell class="col-span-2 content-center">
            <!-- TODO: fix -->
             <div class="flex gap-4 group items-center">
              <div>
                {#if !user.nickname}
                  <p class="text-muted-foreground">Set nickname here...</p>
                {:else}
                  {user.nickname}
                {/if}
              </div>
              <div class="cursor-pointer opacity-0 group-hover:opacity-100">
                <Pencil size="18" />
              </div>
              </div>
          </Table.Cell>
          <Table.Cell class="flex items-center justify-center align-middle">
            {#if user.isAdmin}
              <div
                class={$page.data.currentUser.id === user._id
                  ? "cursor-not-allowed"
                  : ""}
              >
                <div
                  class={$page.data.currentUser.id === user._id
                    ? "pointer-events-none opacity-60"
                    : ""}
                >
                  <RemoveAdminForm {user} />
                </div>
              </div>
            {:else}
              <AddAdminForm {user} />
            {/if}
          </Table.Cell>
          <Table.Cell class="flex items-center justify-center align-middle">
            <div
              class={$page.data.currentUser.id === user._id
                ? "cursor-not-allowed"
                : ""}
            >
              <div
                class={$page.data.currentUser.id === user._id
                  ? "pointer-events-none opacity-60"
                  : ""}
              >
                <RemoveUserForm {user} />
              </div>
            </div>
          </Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  </ScrollArea>
</Table.Root>
