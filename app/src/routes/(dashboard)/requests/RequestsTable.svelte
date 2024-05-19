<script lang="ts">
  import * as Table from "$lib/components/ui/table";

  import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import { CircleChevronRight } from "lucide-svelte";
  import { goto } from "$app/navigation";
  import type { Request } from "./typeRequest";

  export let requests: Request[];
</script>

<Table.Root>
  <Table.Header>
    <Table.Row class="auto-rows grid w-full grid-cols-12 text-left">
      <Table.Head class="col-span-1 grid items-center">ID</Table.Head>
      <Table.Head class="col-span-1 grid items-center">Type</Table.Head>
      <Table.Head class="col-span-2 grid items-center"
        >Student Number</Table.Head
      >
      <Table.Head class="col-span-2 grid items-center">Student Email</Table.Head
      >
      <Table.Head class="col-span-3 grid items-center">Purpose</Table.Head>
      <Table.Head class="col-span-2 grid items-center">Remarks</Table.Head>
      <Table.Head class="col-span-1 hidden items-center">Actions</Table.Head>
    </Table.Row>
  </Table.Header>
  <ScrollArea class="h-[28rem]">
    <Table.Body>
      {#each requests as request (request._id)}
        <Table.Row
          class="auto-rows grid w-full grid-cols-12 items-center text-left"
        >
          <Table.Cell class="col-span-1"
            >{request._id.length > 12
              ? request._id.substring(0, 12) + "..."
              : request._id}</Table.Cell
          >
          <Table.Cell class="col-span-1">{request.requestTypeId}</Table.Cell>
          <Table.Cell class="col-span-2">{request.studentNumber}</Table.Cell>
          <Table.Cell class="col-span-2">{request.studentEmail}</Table.Cell>
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
