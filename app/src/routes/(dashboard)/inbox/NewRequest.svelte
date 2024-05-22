<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
  import { Label } from "$lib/components/ui/label";
  import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte";

  import * as Command from "$lib/components/ui/command/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import * as Form from "$lib/components/ui/form";
  import * as Popover from "$lib/components/ui/popover/index.js";

  import Plus from "lucide-svelte/icons/plus";
  import FilePlus from "lucide-svelte/icons/file-plus";
  import Check from "svelte-radix/Check.svelte";

  import { tick } from "svelte";

  import { formSchema, type FormSchema } from "./schema";
  import {
    type SuperValidated,
    type Infer,
    superForm,
  } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { cn } from "$lib/utils.js";

  import CaretSort from "svelte-radix/CaretSort.svelte";

  export let data: SuperValidated<Infer<FormSchema>>;
  export let latestReqTypes: RequestType[];

  const form = superForm(data, {
    validators: zodClient(formSchema),
  });

  const { form: formData, enhance } = form;

  let reqTypeSelection: { [id: string]: boolean } = {};

  let selectedCount: number = 0;
  let open = false;

  $: if ($formData.selectedReqTypeIds.length == 0) {
    selectedCount = 0;
    for (const id in reqTypeSelection) {
      reqTypeSelection[id] = false;
    }
  }

  for (const reqType of latestReqTypes) {
    reqTypeSelection[reqType._id] = false;
  }

  function updateSelection(id: string, value: boolean | "indeterminate") {
    if (value === "indeterminate" || value == false) {
      reqTypeSelection[id] = false;
      selectedCount--;
    } else {
      reqTypeSelection[id] = true;
      selectedCount++;
    }

    // store selection in JSON string array
    $formData.selectedReqTypeIds = "[";
    for (const id in reqTypeSelection) {
      if (reqTypeSelection[id]) $formData.selectedReqTypeIds += '"' + id + '",';
    }
    $formData.selectedReqTypeIds = $formData.selectedReqTypeIds.replace(
      /,$/,
      "",
    ); //remove excess comma if there is one
    $formData.selectedReqTypeIds += "]";
  }

  // We want to refocus the trigger button when the user selects
  // an item from the list so users can continue navigating the
  // rest of the form with the keyboard.
  function closeAndFocusTrigger(triggerId: string) {
    open = false;
    tick().then(() => {
      document.getElementById(triggerId)?.focus();
    });
  }
</script>

<Dialog.Root>
  <Dialog.Trigger>
    <Button class="h-9 gap-2">
      <FilePlus size="18" /> Create Request
    </Button>
  </Dialog.Trigger>
  <Dialog.Content class="max-h-screen overflow-y-scroll">
    <form action="?/add_request" method="POST" use:enhance>
      <Dialog.Header>
        <Dialog.Title>Add details for new request.</Dialog.Title>
      </Dialog.Header>
      <div class="grid gap-4 py-4">
        <Form.Field
          {form}
          name="studentNumber"
          class="gap-cols-4 grid items-center"
        >
          <Form.Control let:attrs>
            <Form.Label>Student Number</Form.Label>
            <Input
              class="col-span-3"
              {...attrs}
              bind:value={$formData.studentNumber}
            />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field
          {form}
          name="studentName"
          class="gap-cols-4 grid items-center"
        >
          <Form.Control let:attrs>
            <Form.Label>Student Name</Form.Label>
            <Input
              class="col-span-3"
              {...attrs}
              bind:value={$formData.studentName}
            />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field
          {form}
          name="studentEmail"
          class="gap-cols-4 grid items-center"
        >
          <Form.Control let:attrs>
            <Form.Label>Student Email</Form.Label>
            <Input
              class="col-span-3"
              {...attrs}
              bind:value={$formData.studentEmail}
            />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="purpose" class="gap-cols-4 grid items-center">
          <Form.Control let:attrs>
            <Form.Label>Purpose</Form.Label>
            <Textarea
              class="col-span-3"
              {...attrs}
              bind:value={$formData.purpose}
            />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="remarks" class="gap-cols-4 grid items-center">
          <Form.Control let:attrs>
            <Form.Label>Remarks</Form.Label>
            <Textarea
              class="col-span-3"
              {...attrs}
              bind:value={$formData.remarks}
            />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="selectedReqTypeIds" class="flex flex-col">
          <Popover.Root bind:open>
            <Form.Control let:attrs>
              <Form.Label>Request Types</Form.Label>
              <Popover.Trigger asChild let:builder role="combobox" {...attrs}>
                <Button
                  builders={[builder]}
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  class="w-full justify-between"
                >
                  {selectedCount == 0
                    ? "Select atleast one request type"
                    : selectedCount + " selected"}
                  <CaretSort class="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </Popover.Trigger>
              <input
                hidden
                value={$formData.selectedReqTypeIds}
                name={attrs.name}
              />
            </Form.Control>

            <Popover.Content class="w-full p-0">
              <Command.Root>
                <Command.Input
                  placeholder="Search request type..."
                  class="h-9"
                />
                <Command.Empty>No request type found.</Command.Empty>
                <Command.Group>
                  <ScrollArea class="h-40">
                    {#each latestReqTypes as requestType}
                      <Command.Item value={requestType.title}>
                        <Checkbox
                          bind:checked={reqTypeSelection[requestType._id]}
                          onCheckedChange={(value) =>
                            updateSelection(requestType._id, value)}
                        />
                        <Label class="px-1">
                          {requestType.title}
                        </Label>
                      </Command.Item>
                    {/each}
                  </ScrollArea>
                </Command.Group>
              </Command.Root>
            </Popover.Content>
          </Popover.Root>
          <Form.FieldErrors />
        </Form.Field>
      </div>

      <Dialog.Footer>
        <Button type="submit" class="h-9 gap-2 "><Plus size="18" />Add</Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
