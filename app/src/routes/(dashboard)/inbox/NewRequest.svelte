<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";

  import * as Command from "$lib/components/ui/command/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import * as Form from "$lib/components/ui/form";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
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
  export let requestTypes: RequestType[];

  const form = superForm(data, {
    validators: zodClient(formSchema),
  });

  const { form: formData, enhance } = form;

  let open = false;
  let value = "";

  $: selectedRequestType = requestTypes.find((f) => f.title === value);

  // We want to refocus the trigger button when the user selects
  // an item from the list so users can continue navigating the
  // rest of the form with the keyboard.
  function closeAndFocusTrigger(triggerId: string) {
    open = false;
    tick().then(() => {
      document.getElementById(triggerId)?.focus();
    });
  }

  import { updateFlash } from "sveltekit-flash-message";
  import { page } from "$app/stores";

  async function submitForm(e: Event) {
    const form = e.target as HTMLFormElement;
    const body = new FormData(e.target as HTMLFormElement);
    await fetch(form.action, { method: form.method, body });
    await updateFlash(page);
  }
</script>

<Dialog.Root>
  <Dialog.Trigger>
    <Button class="gap-4 p-3"><FilePlus size="20" /> Create Request</Button>
  </Dialog.Trigger>
  <Dialog.Content>
    <form
      action="?/add_request"
      method="POST"
      use:enhance
      on:submit|preventDefault={submitForm}
    >
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

        <Form.Field {form} name="requestTypeId" class="flex flex-col">
          <Popover.Root bind:open let:ids>
            <Form.Control let:attrs>
              <Form.Label>Request Type</Form.Label>
              <Popover.Trigger asChild let:builder role="combobox" {...attrs}>
                <Button
                  builders={[builder]}
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  class="w-full justify-between"
                >
                  {selectedRequestType === undefined
                    ? "Select a request type"
                    : selectedRequestType.title}
                  <CaretSort class="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </Popover.Trigger>
              <input
                hidden
                value={selectedRequestType === undefined
                  ? ""
                  : selectedRequestType._id.toString()}
                name={attrs.name}
              />
            </Form.Control>

            <Popover.Content class="w-full p-0">
              <Command.Root>
                <Command.Input placeholder="Search framework..." class="h-9" />
                <Command.Empty>No request type found.</Command.Empty>
                <Command.Group>
                  <ScrollArea class="h-40">
                    {#each requestTypes as requestType}
                      <Command.Item
                        value={requestType.title}
                        onSelect={(currentValue) => {
                          value = currentValue;
                          closeAndFocusTrigger(ids.trigger);
                        }}
                      >
                        <Check
                          class={cn(
                            "mr-2 h-4 w-4",
                            value !== requestType.title && "text-transparent",
                          )}
                        />
                        {requestType.title}
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
        <Button type="submit" class="gap-2 rounded-xl text-white"
          ><Plus />Add</Button
        >
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
