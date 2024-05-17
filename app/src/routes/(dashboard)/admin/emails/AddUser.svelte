<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog";
  import Input from "$lib/components/ui/input/input.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { writable } from "svelte/store";

  let email: string = "";
  let errorMessage = writable("");

  async function handleSubmit(e: Event) {
    // This is the email submit handling for now, i dont know whats happening witht zod and superforms
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const emailValue = formData.get("email") as string;

    if (!emailValue) {
      errorMessage.set("Required.");
      return;
    }

    email = "";
    errorMessage.set("");
    console.log(Object.fromEntries(formData.entries()));

    const response = await fetch("?/add_user", {
      method: "POST",
      body: formData,
    });
    console.log("addUser.svelte response: ", response);
  }
</script>

<Dialog.Root>
  <Dialog.Trigger>
    <Button>Add User</Button>
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Give Access to user</Dialog.Title>
    </Dialog.Header>
    <form
      action="?/add_user"
      method="POST"
      on:submit|preventDefault={handleSubmit}
    >
      <div class="h-28 w-full space-y-4">
        <Label for="email">Email</Label>
        <Input
          type="email"
          id="email"
          name="email"
          placeholder="Example@university.ph"
          bind:value={email}
        />
        {#if $errorMessage}
          <span class="text-sm text-red-600">{$errorMessage}</span>
        {/if}
      </div>
      <Dialog.Footer>
        <Button type="submit">Continue</Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
