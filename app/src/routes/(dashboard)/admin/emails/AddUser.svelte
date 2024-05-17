<script lang="ts">
  import { enhance, applyAction } from "$app/forms";
  import { goto } from "$app/navigation";
  import * as Dialog from "$lib/components/ui/dialog";
  import Input from "$lib/components/ui/input/input.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
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
      use:enhance={() => {
        return async ({ result }) => {
          if (result.type === "redirect") {
            goto(result.location);
          } else {
            await applyAction(result);
          }
        };
      }}
    >
      <div class="h-28 w-full space-y-4">
        <Label for="email">Email</Label>
        <Input
          type="email"
          id="email"
          name="email"
          placeholder="Example@university.ph"
        />
      </div>
      <Dialog.Footer>
        <Button type="submit">Continue</Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
