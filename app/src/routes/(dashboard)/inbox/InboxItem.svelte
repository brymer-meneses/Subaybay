<script lang="ts">
  export let stageTitle: string;
  export let requestTitle: string;
  export let requestId: number;
  export let dateSent: string;

  import clsx from "clsx";

  export let isSelected: boolean;
</script>

<button
  class={clsx("flex w-full flex-row items-center  rounded-md bg-slate-100 p-4")}
>
  <div class="flex w-full flex-col items-start gap-1">
    <div class="flex w-full flex-row justify-between">
      <p class="text-base font-semibold">{stageTitle}</p>
      <p class="text-sm font-thin">{requestId}</p>
    </div>

    <p class="text-sm">{requestTitle}</p>
    <p class="text-sm font-thin">{dateSent}</p>
  </div>
</button>
