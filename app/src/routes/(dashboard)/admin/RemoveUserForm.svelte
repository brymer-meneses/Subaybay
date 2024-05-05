<script lang="ts">
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import { Button } from "$lib/components/ui/button/index.js";

  import Trash from "lucide-svelte/icons/trash";

  export let user: User;
</script>

<AlertDialog.Root>
  <AlertDialog.Trigger>
    <Button variant="link" class="gap-2 text-red-600"
      ><Trash /><span class="hidden lg:inline">Remove User</span></Button
    >
  </AlertDialog.Trigger>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Are you sure?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone. The user below will be removed from the
        whitelisted users. An administrator can add them back later. Are you
        sure you want to continue?
      </AlertDialog.Description>
    </AlertDialog.Header>
    <div class="flex h-20 items-center space-x-4">
      <div class="flex items-center space-x-4">
        <img
          src={user.profileUrl}
          alt={user.name + "'s avatar"}
          class="aspect-square h-12 rounded-full"
        />
        <div>
          <p class="text-sm font-bold leading-none">
            {user.name}
            <span class="text-muted-foreground font-normal"> ({user._id})</span>
          </p>
          <p class="text-muted-foreground text-sm">
            {user.email}
          </p>
        </div>
      </div>
    </div>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action>
        <form action="?/remove_user" method="POST">
          <input type="hidden" name="email" value={user.email} />
          <button type="submit" class="border-none bg-none">Remove User</button>
        </form>
      </AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
