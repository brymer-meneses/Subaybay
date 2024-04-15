<script lang="ts">
  export let stageTitle: string;
  export let requestTitle: string;
  export let requestId: number;
  export let dateSent: string;

  import clsx from "clsx";

  export let isSelected: boolean;
</script>

<button
  class={clsx(
    "flex flex-row items-center w-full  rounded-xl p-4",
    isSelected ? "bg-primary text-white pointer-events-none" : "bg-white",
    !isSelected && "hover:drop-shadow-md",
  )}
  on:click
>
  <div class="flex flex-col w-full items-start gap-1">
    <div class="flex flex-row w-full justify-between">
      <p class="text-base font-semibold">{stageTitle}</p>
      <p class="text-sm font-thin">{requestId}</p>
    </div>

    <p class="text-sm">{requestTitle}</p>
    <p class="text-sm font-thin">{dateSent}</p>
  </div>
</button>
