<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";

  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import * as Form from "$lib/components/ui/form";

  import FilePlus from "lucide-svelte/icons/file-plus";

  import { formSchema, type FormSchema } from "./schema";
  import {
    type SuperValidated,
    type Infer,
    superForm,
  } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { enhance } from "$app/forms";

  export let data: SuperValidated<Infer<FormSchema>>;
  export let processing: boolean = false;

  const form = superForm(data, {
    validators: zodClient(formSchema),
  });

  const { form: formData } = form;

  let open: boolean;

  function onSubmitClicked() {
    open = false;
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Trigger>
    <Button class="h-9 gap-2">
      <!--todo change icon to be more relevant-->
      <FilePlus size="18" /> Edit Request
    </Button>
  </Dialog.Trigger>
  <Dialog.Content>
    <form
      action="?/edit"
      method="POST"
      use:enhance={() => {
        processing = true;

        return async ({ update }) => {
          await update();
          processing = false;
        };
      }}
    >
      <Dialog.Header>
        <Dialog.Title>Edit Request Details</Dialog.Title>
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
      </div>

      <Dialog.Footer>
        <Button type="submit" on:click={onSubmitClicked} class="h-9 gap-2 "
          >Confirm Changes</Button
        >
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
