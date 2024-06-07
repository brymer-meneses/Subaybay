<script lang="ts">
  import * as Pop from "$lib/components/ui/popover";
  import HandlerSelect from "./HandlerSelect.svelte";

  export let users;
  export let processing: boolean;
  export let handlerSelectTitle: string;

  export let nextHandlerId: string;

  let open: boolean = false;

  $: if (processing) open = false;
</script>

<Pop.Popover bind:open>
  <Pop.PopoverTrigger>
    <slot name="button" />
  </Pop.PopoverTrigger>
  <Pop.PopoverContent>
    <div class="flex flex-col justify-center gap-4">
      <HandlerSelect
        {users}
        title={handlerSelectTitle}
        bind:selectedUserId={nextHandlerId}
      />

      <div class="padding-y-4 items-center">
        <slot />
      </div>
    </div>
  </Pop.PopoverContent>
</Pop.Popover>
