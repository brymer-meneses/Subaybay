<script lang="ts">
  import type { RequestSearchItem } from "./RequestsTable.svelte";

  import { Button } from "$lib/components/ui/button";
  import * as Table from "$lib/components/ui/table";
  import { CircleChevronRight, CircleCheck } from "lucide-svelte";

  import { goto } from "$app/navigation";

  export let request: RequestSearchItem;
  export let index: number;
  // export let classification: "pending" | "finished" | "discontinued";

  // let studentName = request.studentName;
  // let studentNumber = request.studentNumber;
  // let studentEmail = request.studentEmail;
  // let purpose = request.purpose;
  // let remarks = request.remarks;
  // let copies = request.copies;
  // let date: string = "";

  // $: {
  //   if (classification !== "finished")
  //     date =
  //       request.history.length > 0
  //         ? request.history[0].dateStarted.toDateString()
  //         : request.currentStage.dateStarted.toDateString();
  //   else date = request.currentStage.dateFinished.toDateString();
  // }
</script>

<Table.Row
  class="auto-rows grid w-full grid-cols-6 items-center text-left xl:grid-cols-12"
>
  <Table.Cell class="col-span-1 hidden xl:grid">
    <span class="font-semibold">{index + 1}</span>
  </Table.Cell>
  <Table.Cell class="col-span-1 px-1">
    <span class="">{request.studentNumber}</span>
  </Table.Cell>
  <Table.Cell class="col-span-2 hidden overflow-hidden text-ellipsis xl:grid">
    <span class="px-1">{request.studentName}</span>
  </Table.Cell>
  <Table.Cell class="col-span-2 hidden overflow-hidden text-ellipsis xl:grid">
    <span class="px-1">{request.studentEmail}</span>
  </Table.Cell>
  <Table.Cell class="col-span-2">
    <span class="px-1">{request.requestTitle}</span>
  </Table.Cell>
  <Table.Cell class="col-span-1 hidden xl:grid">
    <span class="px-1">{request.copies}</span>
  </Table.Cell>
  <Table.Cell class="col-span-2">
    <span class="px-1">{request.date}</span>
  </Table.Cell>
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
