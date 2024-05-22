<script lang="ts">
  import { Input } from "$lib/components/ui/input/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { CirclePlus, CircleMinus } from "lucide-svelte";

  export let max = 99;
  export let value: number = 0;
  let inputValue: string = "";

  $: inputValue = value != 0 ? value.toString() : "";

  export let onUpdated: (prev: number, current: number) => void = (x) => {};

  function onInput() {
    let input = parseInt(inputValue);
    if (!input || input < 0) {
      input = 0;
      inputValue = "";
    }

    if (input > max) {
      input = max;
      inputValue = max.toString();
    }

    const prev = value;
    value = input;

    if (prev != input) {
      onUpdated(prev, value);
    }
  }

  function plus() {
    if (value < max) {
      const prev = value;
      value += 1;
      inputValue = value.toString();
      onUpdated(prev, value);
    }
  }

  function minus() {
    if (value > 0) {
      const prev = value;
      value -= 1;
      inputValue = value.toString();
      onUpdated(prev, value);
    }
  }
</script>

<div class="flex items-center gap-0">
  <Button class="pr-2" variant="ghost" on:click={minus}
    ><CircleMinus size="20" /></Button
  >
  <Input
    class="focus-visible:ring-0.5 h-8 w-12 border-gray-300 text-center focus:outline-none"
    bind:value={inputValue}
    on:input={onInput}
  />
  <Button class="p-2" variant="ghost" on:click={plus}
    ><CirclePlus size="20" /></Button
  >
</div>
