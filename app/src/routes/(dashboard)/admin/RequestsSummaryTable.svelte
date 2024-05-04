<script lang="ts">
  import * as Table from "$lib/components/ui/table/index";
  import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte";

  export let count: RequestTypeInstancesCount[];
</script>

<Table.Root class="mt-4">
  <Table.Caption>
    Showing {count.length}
    {count.length === 1 ? "result" : "results"}
  </Table.Caption>
  <Table.Header>
    <Table.Row class="grid w-full grid-cols-5 text-left">
      <Table.Head>Request Type</Table.Head>
      <Table.Head>Finished</Table.Head>
      <Table.Head>Pending</Table.Head>
      <Table.Head>Stale</Table.Head>
      <Table.Head>Total</Table.Head>
    </Table.Row>
  </Table.Header>
  <ScrollArea class="h-[26rem]">
    <Table.Body>
      {#each count as stat}
        <Table.Row class="grid w-full grid-cols-5 text-left">
          <Table.Cell class="font-semibold">{stat.reqTitle}</Table.Cell>
          <Table.Cell>{stat.total.finished}</Table.Cell>
          <Table.Cell>{stat.total.pending}</Table.Cell>
          <Table.Cell>{stat.total.stale}</Table.Cell>
          <Table.Cell
            >{stat.total.finished +
              stat.total.pending +
              stat.total.stale}</Table.Cell
          >
        </Table.Row>
      {/each}
    </Table.Body>
  </ScrollArea>
</Table.Root>
