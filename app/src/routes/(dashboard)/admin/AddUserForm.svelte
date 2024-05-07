<script lang="ts">
  import { enhance, applyAction } from "$app/forms";
  import { goto } from "$app/navigation";
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import { Button } from "$lib/components/ui/button/index.js";
  import Input from "$lib/components/ui/input/input.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import Plus from "lucide-svelte/icons/plus";
</script>

<AlertDialog.Root>
  <AlertDialog.Trigger>
    <Button><Plus size="20" />Add a User</Button>
  </AlertDialog.Trigger>
  <AlertDialog.Content>
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
      <AlertDialog.Header>
        <AlertDialog.Title>Add a user</AlertDialog.Title>
      </AlertDialog.Header>
      <div class="my-4 flex h-40 w-full flex-col gap-1.5 space-y-2">
        <Label for="email">Email</Label>
        <Input type="email" id="email" placeholder="Email" />
        <p class="text-muted-foreground text-sm">
          Enter a valid email address.
        </p>
      </div>
      <AlertDialog.Footer>
        <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
        <AlertDialog.Action>
          <button type="submit" class="border-none bg-none">Add User</button>
        </AlertDialog.Action>
      </AlertDialog.Footer>
    </form>
  </AlertDialog.Content>
</AlertDialog.Root>
