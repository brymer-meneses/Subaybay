<script lang="ts">
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import { Button } from "$lib/components/ui/button/index.js";

  import { goto } from "$app/navigation";

  import UserRoundMinus from "lucide-svelte/icons/user-round-minus";

  export let user: {
    _id: string;
    name: string;
    email: string;
    profileUrl: string;
    isAdmin: boolean;
  };
</script>

<AlertDialog.Root>
  <AlertDialog.Trigger>
    <Button variant="link" class="gap-2 text-red-600"
      ><UserRoundMinus />Remove Admin Privileges</Button
    >
  </AlertDialog.Trigger>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Are you sure?</AlertDialog.Title>
      <AlertDialog.Description>
        The user's administrative privileges will be removed. An administrator
        can add them back later. Are you sure you want to remove?
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
        <form action="?/remove_admin" method="POST">
          <input type="hidden" name="email" value={user.email} />
          <button type="submit" class="border-none bg-none">Remove</button>
        </form>
      </AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
