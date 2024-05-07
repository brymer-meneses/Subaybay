<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Table from "$lib/components/ui/table";
  import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte";

  //export let requests: OURRequest[];
  // For testing
  const requests = [
    {
      _id: "juststarted",
      requestTypeId: "coe",
      studentNumber: "2020",
      studentName: "Hello World",
      studentEmail: "student@student.com",
      purpose: "Purpose",
      remarks: "Good Morning",
    },
  ];
</script>

<main class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
  <div class="grid flex-1 auto-rows-max items-start gap-4 pr-12">
    <Card.Root>
      <Card.Header class="px-7">
        <Card.Title>Requests</Card.Title>
        <Card.Description>List of requests</Card.Description>
      </Card.Header>
      <Card.Content class="p-6 text-sm">
        <Table.Root>
          <Table.Header>
            <Table.Row class="grid w-full grid-cols-12 text-left">
              <Table.Head class="col-span-1">ID</Table.Head>
              <Table.Head class="col-span-1">Type</Table.Head>
              <Table.Head class="col-span-2">Student Number</Table.Head>
              <Table.Head class="col-span-2">Student Email</Table.Head>
              <Table.Head class="col-span-3">Purpose</Table.Head>
              <Table.Head class="col-span-3">Remarks</Table.Head>
            </Table.Row>
          </Table.Header>
          <ScrollArea class="h-[28rem]">
            <Table.Body>
              {#each requests as request (request._id)}
                <Table.Row class="grid w-full grid-cols-12 text-left">
                  <Table.Cell class="col-span-1">{request._id}</Table.Cell>
                  <Table.Cell class="col-span-1"
                    >{request.requestTypeId}</Table.Cell
                  >
                  <Table.Cell class="col-span-2"
                    >{request.studentNumber}</Table.Cell
                  >
                  <Table.Cell class="col-span-2"
                    >{request.studentEmail}</Table.Cell
                  >
                  <Table.Cell class="col-span-3">{request.purpose}</Table.Cell>
                  <Table.Cell class="col-span-3">{request.remarks}</Table.Cell>
                </Table.Row>
              {/each}
            </Table.Body>
          </ScrollArea>
        </Table.Root>
      </Card.Content>
    </Card.Root>
  </div>
</main>
