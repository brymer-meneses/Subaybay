<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
  } from "$lib/components/ui/dropdown-menu";
  import Plus from "lucide-svelte/icons/plus";
  import FilePlus from "lucide-svelte/icons/file-plus";
  import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte";

  export let requestTypes: any[];

  let selectedRequestType = requestTypes[0];
  let requestTypeName = selectedRequestType.title;
  let requestTypeId = selectedRequestType._id;

  function onDropdownChange(value: string | undefined) {
    value ??= "0";
    const index = parseInt(value);
    selectedRequestType = requestTypes[index];
    requestTypeName = selectedRequestType.title;
    requestTypeId = selectedRequestType._id;
  }
</script>

<Dialog.Root>
  <Dialog.Trigger>
    <Button class="gap-4 p-3"><FilePlus size="20" /> Create Request</Button>
  </Dialog.Trigger>
  <Dialog.Content>
    <form action="?/add_request" method="POST">
      <Dialog.Header>
        <Dialog.Title>Add details for new request.</Dialog.Title>
      </Dialog.Header>
      <div class="grid gap-4 py-4">
        <div class="gap-cols-4 grid items-center gap-4">
          <Label for="studentNumber">Student Number:</Label>
          <Input id="studentNumber" name="studentNumber" class="col-span-3" />
        </div>
        <div class="gap-cols-4 grid items-center gap-4">
          <Label for="studentName">Student Name:</Label>
          <Input id="studentName" name="studentName" class="col-span-3" />
        </div>
        <div class="gap-cols-4 grid items-center gap-4">
          <Label for="studentEmail">Student Email:</Label>
          <Input id="studentEmail" name="studentEmail" class="col-span-3" />
        </div>
        <div class="gap-cols-4 grid items-center gap-4">
          <Label for="purpose">Purpose:</Label>
          <Input id="purpose" name="purpose" class="col-span-3" />
          <!-- todo Convert to textarea? -->
        </div>
        <div class="gap-cols-4 grid items-center gap-4">
          <Label for="remarks">Remarks:</Label>
          <Input id="remarks" name="remarks" class="col-span-3" />
          <!-- todo Convert to textarea? -->
        </div>
        <div class="gap-cols-4 grid items-center gap-4">
          <Label for="requestTypeId">Request Type:</Label>
          <DropdownMenu>
            <DropdownMenuTrigger class="col-span-3">
              <Button variant="outline">{requestTypeName}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <ScrollArea class="h-[400px]">
                <DropdownMenuRadioGroup value=0 onValueChange={onDropdownChange}>
                  {#each requestTypes as requestType, index}
                    <DropdownMenuRadioItem value={index.toString()}>
                      {requestType.title}
                    </DropdownMenuRadioItem>
                  {/each}
                </DropdownMenuRadioGroup>
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>
          <input type="hidden" name="requestTypeId" value={requestTypeId} />
        </div>
      </div>
      <Dialog.Footer>
        <Button type="submit" class="gap-2 rounded-xl text-white"
          ><Plus />Add</Button
        >
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
