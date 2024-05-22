<script lang="ts">
  import * as Pop from "$lib/components/ui/popover";

  export let input: string;
</script>

<Pop.Popover>
  <Pop.PopoverTrigger
    class="w-full overflow-hidden text-ellipsis whitespace-nowrap rounded border border-gray-100"
  >
    <span class={input.length == 0 ? "text-gray-400" : ""}>
      {input.length > 0 ? input : "empty"}
    </span>
  </Pop.PopoverTrigger>
  <Pop.PopoverContent>
      <div>
        {input}
      </div>
  </Pop.PopoverContent>
</Pop.Popover>
