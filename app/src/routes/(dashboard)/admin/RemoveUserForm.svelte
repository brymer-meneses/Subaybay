<script lang="ts">
  import { enhance, applyAction } from "$app/forms";
  import { goto } from "$app/navigation";
  import * as Dialog from "$lib/components/ui/dialog";
  import { Button } from "$lib/components/ui/button/index.js";

  import Trash from "lucide-svelte/icons/trash";

  export let user: User;
</script>

<Dialog.Root>
  <Dialog.Trigger>
    <Button variant="link" class="gap-2 text-red-600"
      ><Trash /><span class="hidden lg:inline">Remove User</span></Button
    >
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Are you sure?</Dialog.Title>
      <Dialog.Description>
        This action cannot be undone. The user below will be removed from the
        whitelisted users. An administrator can add them back later. Are you
        sure you want to continue?
      </Dialog.Description>
    </Dialog.Header>
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
        <input type="hidden" name="email" value={user.email} />
        <Button type="submit" variant="destructive">Remove User</Button>
      </form>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
