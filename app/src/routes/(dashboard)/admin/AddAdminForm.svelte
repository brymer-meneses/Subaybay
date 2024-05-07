<script lang="ts">
  import { enhance, applyAction } from "$app/forms";
  import { goto } from "$app/navigation";
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import { Button } from "$lib/components/ui/button/index.js";

  import UserRoundPlus from "lucide-svelte/icons/user-round-plus";

  export let user: User;
</script>

<AlertDialog.Root>
  <AlertDialog.Trigger>
    <Button variant="link" class="gap-2"
      ><UserRoundPlus /><span class="hidden lg:inline">Add Admin</span></Button
    >
  </AlertDialog.Trigger>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Are you sure?</AlertDialog.Title>
      <AlertDialog.Description>
        This user will get administrative privileges. Are you sure you want to
        continue?
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
        <form
          action="?/add_admin"
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
          <button type="submit" class="border-none bg-none">Continue</button>
        </form>
      </AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
