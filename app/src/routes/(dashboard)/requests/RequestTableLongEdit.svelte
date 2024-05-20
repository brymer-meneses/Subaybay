<script lang="ts">
  import * as Pop from "$lib/components/ui/popover";
  import { Textarea } from "$lib/components/ui/textarea";

  export let input: string;
</script>

    <Pop.Popover>
        <Pop.PopoverTrigger class="w-full">
            <span class="inline-flex w-full rounded px-1 h-5 border border-gray-300">
                {input.length > 20 ? input.substring(0, 20) + "..." : input.padEnd(20, " ")}
            </span>
        </Pop.PopoverTrigger>
        <Pop.PopoverContent>
            <Textarea bind:value={input} />
        </Pop.PopoverContent>
    </Pop.Popover>
    