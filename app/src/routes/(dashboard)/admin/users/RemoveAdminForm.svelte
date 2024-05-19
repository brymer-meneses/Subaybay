<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog";
  import { enhance, applyAction } from "$app/forms";
  import { goto } from "$app/navigation";
  import { Button } from "$lib/components/ui/button/index.js";

  import UserRoundMinus from "lucide-svelte/icons/user-round-minus";

  export let user: User;
</script>

<Dialog.Root>
  <Dialog.Trigger>
    <Button variant="link" class="gap-2 text-red-600"
      ><UserRoundMinus /><span class="hidden lg:inline">Remove Admin</span
      ></Button
    >
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Are you sure?</Dialog.Title>
      <Dialog.Description>
        The user below will have their administrative privileges removed. Are
        you sure you want to continue?
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
            <span class="font-normal text-muted-foreground"> ({user._id})</span>
          </p>
          <p class="text-sm text-muted-foreground">
            {user.email}
          </p>
        </div>
      </div>
    </div>
    <Dialog.Footer>
      <form
        action="?/remove_admin"
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
        <Button type="submit">Remove Admin</Button>
      </form>
    </Dialog.Footer></Dialog.Content
  ></Dialog.Root
>
