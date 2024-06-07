<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
  import { Label } from "$lib/components/ui/label";
  import { Separator } from "$lib/components/ui/separator";

  import * as Command from "$lib/components/ui/command/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import * as Form from "$lib/components/ui/form";
  import * as Popover from "$lib/components/ui/popover/index.js";

  import Plus from "lucide-svelte/icons/plus";
  import FilePlus from "lucide-svelte/icons/file-plus";

  import { formSchema, type FormSchema } from "./schema";
  import {
    type SuperValidated,
    type Infer,
    superForm,
  } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";

  import CaretSort from "svelte-radix/CaretSort.svelte";
  import CopiesCountInput from "./CopiesCountInput.svelte";

  export let data: SuperValidated<Infer<FormSchema>>;
  export let latestReqTypes: RequestType[];

  const form = superForm(data, {
    validators: zodClient(formSchema),
  });

  const { form: formData, enhance } = form;

  let reqTypeCounts: { [id: string]: number } = {};

  let selectedCount: number = 0;
  let open = false;

  $: if ($formData.selectedReqTypeIds.length == 0) {
    selectedCount = 0;
    for (const id in reqTypeCounts) {
      reqTypeCounts[id] = 0;
    }
  }

  for (const reqType of latestReqTypes) {
    reqTypeCounts[reqType._id] = 0;
  }

  function updateSelection(id: string, prev: number, value: number) {
    if (!(id in reqTypeCounts)) {
      return;
    }

    if (prev == 0 && value != 0) {
      selectedCount++;
    } else if (value == 0) {
      selectedCount--;
    }

    const nonzeros: { id: string; count: number }[] = [];
    for (const id in reqTypeCounts) {
      if (reqTypeCounts[id] > 0)
        nonzeros.push({ id, count: reqTypeCounts[id] });
    }

    $formData.selectedReqTypeIds = JSON.stringify(nonzeros);
    console.log($formData.selectedReqTypeIds);
  }
</script>

<Dialog.Root>
  <Dialog.Trigger>
    <Button class="h-9 gap-2">
      <FilePlus size="18" /> Create Request
    </Button>
  </Dialog.Trigger>
  <Dialog.Content
    class="max-h-screen sm:overflow-y-scroll md:overflow-y-scroll"
  >
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
                  <ScrollArea class="h-52">
                    {#each latestReqTypes as requestType}
                      <Command.Item value={requestType.title}>
                        <CopiesCountInput
                          bind:value={reqTypeCounts[requestType._id]}
                          onUpdated={(prev, value) =>
                            updateSelection(requestType._id, prev, value)}
                        />
                        <Label class="px-1">
                          {requestType.title}
                        </Label>
                      </Command.Item>
                      <Separator class="my-0" />
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
