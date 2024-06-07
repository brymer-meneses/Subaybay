<script lang="ts">
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Button } from "$lib/components/ui/button";

  import HandlerSelect from "../../inbox/buttonComponents/HandlerSelect.svelte";
  import type { User } from "$lib/server/database";
  import { enhance } from "$app/forms";

  export let users: { [key: string]: User };

  export let open: boolean;
  let nextHandlerId = "";
  let processing = false;
</script>

<Dialog.Root bind:open>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Reassign Request</Dialog.Title>
    </Dialog.Header>
    <Dialog.Description class="">
      {#if !(nextHandlerId in users)}
        Please select someone to reassign the request to
      {:else}
        This stage will be reassigned to
        <strong>
          {users[nextHandlerId]?.name}
        </strong>. <br />
        <br />
        It will be removed from the current handler's inbox.
        <br />
        Are you sure?
      {/if}
    </Dialog.Description>
    <Separator />
    <HandlerSelect
      {users}
      title={"Reassign to"}
      bind:selectedUserId={nextHandlerId}
    />
    <Dialog.Footer>
      <form
        action="?/reassign"
        method="POST"
        use:enhance={() => {
          processing = true;

          return async ({ update }) => {
            await update();
            processing = false;
            open = false;
          };
        }}
      >
        <input type="hidden" name="nextHandlerId" value={nextHandlerId} />
        {#if !processing}
          <Button
            class="h-9"
            variant="destructive"
            disabled={!(nextHandlerId in users)}
            type="submit"
          >
            Confirm. Reassign.
          </Button>
        {:else}
          Processing... Please Wait
        {/if}
      </form>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
