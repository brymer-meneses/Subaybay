<script lang="ts">
  import { createTable, Render, Subscribe } from "svelte-headless-table";
  import { readable } from "svelte/store";
  import * as Table from "$lib/components/ui/table";
  import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte";
  import Separator from "$lib/components/ui/separator/separator.svelte";

  export let users: {
    name: string;
    email: string;
    profileUrl: string;
    isAdmin: boolean;
  }[];

  const table = createTable(readable(users));
  const columns = table.createColumns([
    table.column({
      accessor: "name",
      header: "Name",
    }),
    table.column({
      accessor: "email",
      header: "Email",
    }),
    table.column({
      accessor: "isAdmin",
      header: "Admin Privileges",
    }),
  ]);

  const { headerRows, pageRows, tableAttrs, tableBodyAttrs } =
    table.createViewModel(columns);
</script>

<div class="w-[720px]">
  <div class="rounded-md border">
    <ScrollArea class="relative h-96 overflow-auto">
      <Table.Root {...$tableAttrs}>
        <Table.Header class="sticky top-0">
          {#each $headerRows as headerRow}
            <Subscribe rowAttrs={headerRow.attrs()}>
              <Table.Row>
                {#each headerRow.cells as cell (cell.id)}
                  <Subscribe
                    attrs={cell.attrs()}
                    let:attrs
                    props={cell.props()}
                  >
                    <Table.Head {...attrs}>
                      <Render of={cell.render()} />
                    </Table.Head>
                  </Subscribe>
                {/each}
              </Table.Row>
            </Subscribe>
          {/each}
        </Table.Header>
        <Table.Body {...$tableBodyAttrs}>
          {#each $pageRows as row (row.id)}
            <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
              <Table.Row {...rowAttrs}>
                {#each row.cells as cell (cell.id)}
                  <Subscribe attrs={cell.attrs()} let:attrs>
                    <Table.Cell {...attrs}>
                      <Render of={cell.render()} />
                    </Table.Cell>
                  </Subscribe>
                {/each}
              </Table.Row>
            </Subscribe>
          {/each}
        </Table.Body>
      </Table.Root>
    </ScrollArea>
  </div>
</div>
<!-- <DropdownMenu.Root>
  <DropdownMenu.Trigger><Ellipsis /></DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Group>
      <DropdownMenu.Item>Remove User</DropdownMenu.Item>
      <DropdownMenu.Item>Make Admin</DropdownMenu.Item>
    </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root> -->
