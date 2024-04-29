<script lang="ts">
  import * as Table from "$lib/components/ui/table/index";
  import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte";

  // everything here is for dummy data
  function createRandomRow() {
    let result = "ReqType ";
    for (let i = 0; i < 5; i++) {
      const randomChar = Math.floor(Math.random() * (127 - 32) + 32);
      result += String.fromCharCode(randomChar);
    }

    const f = Math.floor(Math.random() * 100);
    const p = Math.floor(Math.random() * 100);
    const s = Math.floor(Math.random() * 100);
    const total = f + p + s;
    return { type: result, f, p, s, total };
  }
  let rows = Array.from({ length: 10 }, createRandomRow);
</script>

<Table.Root class="mt-4">
  <Table.Header>
    <Table.Row class="grid w-full grid-cols-5 text-left">
      <Table.Head>Request Type</Table.Head>
      <Table.Head>Finished</Table.Head>
      <Table.Head>Pending</Table.Head>
      <Table.Head>Stale</Table.Head>
      <Table.Head>Total</Table.Head>
    </Table.Row>
  </Table.Header>
  <ScrollArea class="h-[28rem]">
    <Table.Body>
      {#each rows as row}
        <Table.Row class="grid w-full grid-cols-5 text-left">
          <Table.Cell>{row.type}</Table.Cell>
          <Table.Cell>{row.f}</Table.Cell>
          <Table.Cell>{row.p}</Table.Cell>
          <Table.Cell>{row.s}</Table.Cell>
          <Table.Cell>{row.total}</Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  </ScrollArea>
</Table.Root>
