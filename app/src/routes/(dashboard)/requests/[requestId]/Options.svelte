<script lang="ts">
  import { page } from "$app/stores";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";

  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import * as Form from "$lib/components/ui/form";

  import Pencil from "lucide-svelte/icons/pencil";
  import UsersRound from "lucide-svelte/icons/users-round";
  import EllipsisVertical from "lucide-svelte/icons/ellipsis-vertical";

  import type { User } from "$lib/server/database";
  import ReassignDialog from "./ReassignDialog.svelte";

  import { formSchema, type FormSchema } from "./schema";
  import {
    type SuperValidated,
    type Infer,
    superForm,
  } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { enhance } from "$app/forms";

  export let users: { [key: string]: User };
  export let data: SuperValidated<Infer<FormSchema>>;
  export let processing: boolean = false;

  const form = superForm(data, {
    validators: zodClient(formSchema),
  });

  const { form: formData } = form;

  let editRequestDialogOpen: boolean = false;
  let confirmMarkStaleDialogOpen: boolean = false;
  let reassignDialogOpen: boolean = false;

  let copiesInput = $formData.copies.toString();

  $: $formData.copies = parseInt(copiesInput) || 0;
  $: isFinished = $page.data.request.isFinished;
  $: isStale = isFinished && !$page.data.request.currentStage.finished;
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    <Button variant="ghost"><EllipsisVertical /></Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Item
      class="flex gap-4"
      on:click={() => (editRequestDialogOpen = !editRequestDialogOpen)}
    >
      <Pencil size="18" /> Edit Request
    </DropdownMenu.Item>
    {#if !isFinished}
      <DropdownMenu.Item
        class="flex gap-4"
        on:click={() =>
          (confirmMarkStaleDialogOpen = !confirmMarkStaleDialogOpen)}
      >
        <UsersRound size="18" />Mark as stale</DropdownMenu.Item
      >
    {/if}
    {#if isStale || !isFinished}
      <DropdownMenu.Item
        class="flex gap-4"
        on:click={() => (reassignDialogOpen = !reassignDialogOpen)}
      >
        <UsersRound size="18" />
        Reassign
      </DropdownMenu.Item>
    {/if}
  </DropdownMenu.Content>
</DropdownMenu.Root>

<!--Mark as Stale-->
{#if !$page.data.request.isFinished}
  <Dialog.Root bind:open={confirmMarkStaleDialogOpen}>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Are you sure?</Dialog.Title>
      </Dialog.Header>
      <Dialog.Description class="">
        The request with details below will be marked as stale (discontinued).<br
        />
        This action cannot be undone.
      </Dialog.Description>
      <Separator />
      <div class="flex flex-col gap-4">
        <p class="ml-4">
          <span class="-mx-4 font-semibold">Request ID:</span> <br />{$page.data
            .request._id}
        </p>
        <p class="ml-4">
          <span class="-mx-4 font-semibold">Requested Form:</span> <br />{$page
            .data.requestType.title}
        </p>
        <p class="ml-4">
          <span class="-mx-4 font-semibold">No. of Copies:</span> <br />{$page
            .data.request.copies}
        </p>
        <p class="ml-4">
          <span class="-mx-4 font-semibold">Student Number:</span> <br />{$page
            .data.request.studentNumber}
        </p>
        <p class="ml-4">
          <span class="-mx-4 font-semibold">Requested by:</span> <br />{$page
            .data.request.studentName}
        </p>
      </div>
      <Dialog.Footer>
        <form method="POST" action="?/mark_stale">
          <input
            type="hidden"
            value={$page.data.request._id}
            name="requestId"
          />
          <Button type="submit" variant="destructive">Continue</Button>
        </form>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>
{/if}

<!--Edit Request-->
<Dialog.Root bind:open={editRequestDialogOpen}>
  <Dialog.Content>
    <form
      action="?/edit"
      method="POST"
      use:enhance={() => {
        processing = true;

        return async ({ update, result }) => {
          await update();
          processing = false;
          if (result.type === "success") editRequestDialogOpen = false;
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
              disabled={processing}
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
              disabled={processing}
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
              disabled={processing}
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
              disabled={processing}
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
              disabled={processing}
            />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
      </div>

      <Form.Field {form} name="copies" class="gap-cols-4 grid items-center">
        <Form.Control let:attrs>
          <Form.Label>Copies</Form.Label>
          <Input
            disabled={processing}
            type="number"
            class="col-span-3"
            {...attrs}
            bind:value={copiesInput}
            on:input={() => {
              copiesInput = copiesInput.replace(/[^\-0-9]/gm, "");
            }}
          />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Dialog.Footer>
        {#if processing}
          Processing... Please Wait
        {:else}
          <Button type="submit" class="h-9 gap-2" disabled={processing}>
            Confirm Changes
          </Button>
        {/if}
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>

<!--Reassign-->
{#if isStale || !isFinished}
  <ReassignDialog {users} bind:open={reassignDialogOpen} />
{/if}
