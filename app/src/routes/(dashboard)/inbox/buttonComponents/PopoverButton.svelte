<script lang="ts">
  import * as Pop from "$lib/components/ui/popover";
  import { Button } from "$lib/components/ui/button";
  import HandlerSelect from "./HandlerSelect.svelte";

  export let users;
  export let processing: boolean;

  export let nextHandlerId: string;

  $: popoverOpen = processing;

  function onOpenChange(value: boolean) {
    popoverOpen = value && !processing;
  }
</script>

<Pop.Popover open={popoverOpen && !processing} {onOpenChange}>
  <Pop.PopoverTrigger>
    <slot name="button" />
  </Pop.PopoverTrigger>
  <Pop.PopoverContent>
    <div class="flex flex-col justify-center gap-4">
      <HandlerSelect {users} bind:selectedUserId={nextHandlerId} />

      <div class="padding-y-4 items-center">
        <slot />
      </div>
    </div>
  </Pop.PopoverContent>
</Pop.Popover>
