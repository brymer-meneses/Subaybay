<script lang="ts">
  import { page } from "$app/stores";
  import * as Table from "$lib/components/ui/table";

  import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte";
  import { Badge } from "$lib/components/ui/badge/index.js";

  import RevokeAccess from "./RevokeAccess.svelte";

  export let emails: PermittedEmail[];
</script>

<Table.Root class="mt-4">
  <Table.Caption
    >Showing {emails.length}
    {emails.length === 1 ? "result" : "results"}.</Table.Caption
  >
  <Table.Header>
    <Table.Row class="grid w-full grid-cols-6 text-left">
      <Table.Head class="col-span-2 ">User</Table.Head>
      <Table.Head class="col-span-2 ">Roles</Table.Head>
      <Table.Head class="col-span-2 text-center ">Actions</Table.Head>
    </Table.Row>
  </Table.Header>
  <ScrollArea class="h-[28rem]">
    <Table.Body>
      {#each emails as email}
        <Table.Row class="grid w-full grid-cols-6 text-left">
          <Table.Cell class="col-span-2">
            <div class="mb-4 flex items-center justify-between space-x-4">
              {email.email}
            </div>
          </Table.Cell>
          <Table.Cell class="col-span-2">
            <Badge variant="outline">Permitted Email</Badge>
          </Table.Cell>
          <Table.Cell class="col-span-2 flex justify-center">
            <RevokeAccess {email} />
          </Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  </ScrollArea>
</Table.Root>
