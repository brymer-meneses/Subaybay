<script lang="ts">

  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "$lib/components/ui/popover";
  import { Button } from "$lib/components/ui/button";
  import HandlerSelect from "./HandlerSelect.svelte";

  import CheckCheck from "lucide-svelte/icons/check-check";

  export let selectedStage;
  export let users;
  export let processing: boolean;

  export let nextHandlerId: string = selectedStage.nextHandlerId;

  $: popoverOpen = processing;

  function onPopoverOpenChange(value: boolean) {
    popoverOpen = value && !processing;
  }
</script>

<Popover open={popoverOpen && !processing} onOpenChange={onPopoverOpenChange}>
  <PopoverTrigger>
    <Button class="gap-2 rounded-md">
      <CheckCheck />Finish
    </Button>
  </PopoverTrigger>
  <PopoverContent>
    <div class="flex flex-col justify-center gap-4">
      <HandlerSelect {users} bind:selectedUserId={nextHandlerId} />

      <div class="padding-y-4 items-center">
        <slot></slot>
      </div>
    </div>
  </PopoverContent>
</Popover>
