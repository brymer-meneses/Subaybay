<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import * as Table from "$lib/components/ui/table";
  import { CircleChevronRight, CircleCheck } from "lucide-svelte";

  import type { Request } from "$lib/server/database";
  import { goto } from "$app/navigation";
  import { Input } from "$lib/components/ui/input";
  import { enhance } from "$app/forms";
  import RequestTableLongEdit from "./RequestTableLongEdit.svelte";

  export let request: Request;
  export let index: number;

  let processing = false;
  let editing = false;
  let studentName = request.studentName;
  let studentNumber = request.studentNumber;
  let studentEmail = request.studentEmail;
  let purpose = request.purpose;
  let remarks = request.remarks;
  let copies = request.copies;

  function toggleEditing() {
    studentName = request.studentName;
    studentNumber = request.studentNumber;
    studentEmail = request.studentEmail;
    purpose = request.purpose;
    remarks = request.remarks;
    copies = request.copies;

    editing = !editing;
  }
</script>

<Table.Row class="auto-rows grid w-full grid-cols-12 items-center text-left">
  {#if processing}
    <Table.Cell class="col-span-6">Processing... Please Wait</Table.Cell>
  {:else}
    <!--Normal Mode-->
    {#if !editing}
      <Table.Cell class="pxl-1 col-span-1 border-r text-center font-semibold">
        <span class="px-1">{index + 1}</span>
      </Table.Cell>
      <Table.Cell class="pxl-1 col-span-1">
        <span class="px-1">{request.studentNumber}</span>
      </Table.Cell>
      <Table.Cell class="col-span-1">
        <span class="px-1">{request.studentName}</span>
      </Table.Cell>
      <Table.Cell class="col-span-2">
        <span class="px-1">{request.studentEmail}</span>
      </Table.Cell>
      <Table.Cell class="col-span-1">
        <span class="px-1">{request.copies}</span>
      </Table.Cell>
      <Table.Cell class="col-span-2"
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
        <Button variant="link" on:click={toggleEditing}>Edit</Button>
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

      <!--Edit Mode-->
    {:else}
      <Table.Cell class="pxl-1 col-span-1 border-r text-center">
        <span class="px-1">{index + 1}</span>
      </Table.Cell>
      <Table.Cell class="col-span-1">
        <Input
          class="inline-flex h-5 w-auto border-gray-300 px-1 py-1"
          bind:value={studentNumber}
        />
      </Table.Cell>
      <Table.Cell class="col-span-1">
        <Input
          class="inline-flex h-5 w-auto border-gray-300 px-1 py-1"
          bind:value={studentName}
        />
      </Table.Cell>
      <Table.Cell class="col-span-2">
        <Input
          class="inline-flex h-5 w-auto border-gray-300 px-1 py-1"
          bind:value={studentEmail}
        />
      </Table.Cell>
      <Table.Cell class="col-span-1">
        <Input
          class="inline-flex h-5 w-auto border-gray-300 px-1 py-1"
          bind:value={copies}
        />
      </Table.Cell>
      <Table.Cell class="col-span-2">
        <RequestTableLongEdit bind:input={purpose} />
      </Table.Cell>
      <Table.Cell class="col-span-2">
        <RequestTableLongEdit bind:input={remarks} />
      </Table.Cell>
      <Table.Cell class="col-span-1 py-0">
        <Button variant="link" on:click={toggleEditing}>Cancel</Button>
      </Table.Cell>
      <Table.Cell class="col-span-1 py-0">
        <form
          action="?/edit"
          method="POST"
          use:enhance={() => {
            processing = true;

            return async ({ update, result }) => {
              await update();
              if (result.type === "success") {
                request.studentName = studentName;
                request.studentNumber = studentNumber;
                request.studentEmail = studentEmail;
                request.purpose = purpose;
                request.remarks = remarks;
                request.copies = copies;
              }
              toggleEditing();
              processing = false;
            };
          }}
        >
          <input type="hidden" name="requestId" value={request._id} />
          <input type="hidden" name="studentName" value={studentName} />
          <input type="hidden" name="studentEmail" value={studentEmail} />
          <input type="hidden" name="studentNumber" value={studentNumber} />
          <input type="hidden" name="purpose" value={purpose} />
          <input type="hidden" name="remarks" value={remarks} />
          <input type="hidden" name="copies" value={copies} />
          <Button size="icon" variant="ghost" type="submit">
            <CircleCheck class="h-5 w-5 text-emerald-600" />
          </Button>
        </form>
      </Table.Cell>
    {/if}
  {/if}
</Table.Row>
