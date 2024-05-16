<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog";
  import * as Form from "$lib/components/ui/form";

  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input";
  import { formSchema, type FormSchema } from "./schema";
  import {
    type SuperValidated,
    type Infer,
    superForm,
  } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";

  import Plus from "lucide-svelte/icons/plus";

  export let data: SuperValidated<Infer<FormSchema>>;

  const form = superForm(data, {
    validators: zodClient(formSchema),
  });

  const { form: formData, enhance } = form;

  let addUserDialogOpen = false;
</script>

<Dialog.Root bind:open={addUserDialogOpen}>
  <Dialog.Trigger>
    <Button><Plus size="20" />Add a User</Button>
  </Dialog.Trigger>
  <Dialog.Content>
    <form method="POST" action="?/add_user" use:enhance>
      <Dialog.Header>
        <Dialog.Title>Add a user</Dialog.Title>
      </Dialog.Header>
      <div class="grid gap-4 py-4">
        <Form.Field {form} name="email">
          <Form.Control let:attrs>
            <Form.Label>Email</Form.Label>
            <Input {...attrs} bind:value={$formData.email} />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
      </div>
      <Dialog.Footer>
        <Button type="submit">Add User</Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
