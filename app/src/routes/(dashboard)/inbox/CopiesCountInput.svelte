<script lang="ts">
  import { Input } from "$lib/components/ui/input/index.js";

  export let max = 99;
  export let value: number = 0;
  let inputValue: string = "";

  $: inputValue = value != 0 ? value.toString() : "";

  export let onUpdated: (prev: number, current: number) => void = (x) => {};

  function onInput() {
    let input = parseInt(inputValue);
    if (!input || input < 0) {
      input = 0
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
</script>

<Input
  class="h-5 w-[40px] border-gray-300 mr-2 text-center focus-visible:ring-0"
  bind:value={inputValue}
  on:input={onInput}
/>
