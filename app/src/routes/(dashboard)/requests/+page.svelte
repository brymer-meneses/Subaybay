<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Table from "$lib/components/ui/table";
  import * as Tabs from "$lib/components/ui/tabs";

  import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import { CircleChevronRight } from "lucide-svelte";
  import { goto } from "$app/navigation";

  export let user: User[];
  export let data;

  const activeRequests = data.activeRequests;
  const archivedRequets = data.archivedRequests;
</script>

<!-- TODO: make it responsive, can also use data table component -->
<main class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
  <div class="grid flex-1 auto-rows-max items-start gap-4">
    <Tabs.Root value="pending">
      <Tabs.List>
        <Tabs.Trigger value="pending">Pending</Tabs.Trigger>
        <Tabs.Trigger value="finished">Finished</Tabs.Trigger>
        <Tabs.Trigger value="discontinued">Discontinued</Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="pending">
        <Card.Root>
          <Card.Header class="px-7">
            <Card.Title>Requests</Card.Title>
            <Card.Description>List of pending requests</Card.Description>
          </Card.Header>
          <Card.Content class="px-6 text-sm">
            <Table.Root>
              <Table.Header>
                <Table.Row class="auto-rows grid w-full grid-cols-12 text-left">
                  <Table.Head class="col-span-1 grid items-center"
                    >ID</Table.Head
                  >
                  <Table.Head class="col-span-1 grid items-center"
                    >Type</Table.Head
                  >
                  <Table.Head class="col-span-2 grid items-center"
                    >Student Number</Table.Head
                  >
                  <Table.Head class="col-span-2 grid items-center"
                    >Student Email</Table.Head
                  >
                  <Table.Head class="col-span-3 grid items-center"
                    >Purpose</Table.Head
                  >
                  <Table.Head class="col-span-2 grid items-center"
                    >Remarks</Table.Head
                  >
                  <Table.Head class="col-span-1 hidden items-center"
                    >Actions</Table.Head
                  >
                </Table.Row>
              </Table.Header>
              <ScrollArea class="h-[28rem]">
                <Table.Body>
                  {#each activeRequests as request (request._id)}
                    <Table.Row
                      class="auto-rows grid w-full grid-cols-12 items-center text-left"
                    >
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
                      <Table.Cell class="col-span-3"
                        >{request.purpose.length > 35
                          ? request.purpose.substring(0, 35) + "..."
                          : request.purpose}</Table.Cell
                      >
                      <Table.Cell class="col-span-2"
                        >{request.remarks.length > 35
                          ? request.remarks.substring(0, 35) + "..."
                          : request.remarks}</Table.Cell
                      >
                      <Table.Cell class="col-span-1 py-0">
                        <!-- Button for individual request details -->
                        <Button
                          size="icon"
                          variant="ghost"
                          on:click={() => {
                            goto("./requests/" + request._id);
                          }}><CircleChevronRight class="h-5 w-5" /></Button
                        >
                      </Table.Cell>
                    </Table.Row>
                  {/each}
                </Table.Body>
              </ScrollArea>
            </Table.Root>
          </Card.Content>
        </Card.Root>
      </Tabs.Content>
    </Tabs.Root>
  </div>
</main>
