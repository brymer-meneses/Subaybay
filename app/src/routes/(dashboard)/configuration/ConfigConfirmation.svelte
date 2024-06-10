<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog";
  import { Button } from "$lib/components/ui/button";
  import ProcessingPleaseWait from "$lib/components/processing/ProcessingPleaseWait.svelte";

  export let requestTypeTitle: string;
  export let processing: boolean;

  $: popoverOpen = processing;

  function onOpenChange(value: boolean) {
    popoverOpen = value && !processing;
  }
</script>

<Dialog.Root open={popoverOpen && !processing} {onOpenChange}>
  <Dialog.Trigger disabled={processing || !requestTypeTitle}>
    {#if !processing}
      <Button disabled={!requestTypeTitle}>Create</Button>
    {:else}
      <ProcessingPleaseWait />
    {/if}
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Are you sure?</Dialog.Title>
      <Dialog.Description>
        This will create a new request type named
        <strong> {requestTypeTitle} </strong>
        <br /><br />
        Note that the title cannot be changed, please ensure that it is correct.
        <br />
        Anything else can be edited later on.
      </Dialog.Description>
    </Dialog.Header>

    <Dialog.Footer>
      <slot />
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
