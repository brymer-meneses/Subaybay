<script lang="ts">
  import { enhance, applyAction } from "$app/forms";
  import { goto } from "$app/navigation";

  import * as Dialog from "$lib/components/ui/dialog";
  import { Button } from "$lib/components/ui/button";
  import CircleMinus from "lucide-svelte/icons/circle-minus";

  export let email: PermittedEmail;
  let dialogOpened = false;
</script>

<Dialog.Root bind:open={dialogOpened}>
  <Dialog.Trigger>
    <Button variant="link" class="gap-2 text-red-600"
      ><CircleMinus /><span class="hidden lg:inline">Revoke Access</span
      ></Button
    >
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Are you sure?</Dialog.Title>
      <Dialog.Description>
        This action cannot be undone. The email {email.email} will be removed from
        the list of permitted users. An administrator can add them back later. Are
        you sure you want to continue?
      </Dialog.Description>
    </Dialog.Header>
    <Dialog.Footer>
      <form
        action="?/remove_user"
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
        <input type="hidden" name="email" value={email.email} />
        <Button
          type="submit"
          variant="destructive"
          on:click={() => (dialogOpened = !dialogOpened)}>Revoke Access</Button
        >
      </form>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
