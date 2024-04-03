<script lang="ts">
  export let stageTitle: string;
  export let requestTitle: string;
  export let requestId: number;
  export let dateSent: string;
</script>

<button
  class="flex flex-row items-center w-full bg-white rounded-xl p-4 hover:bg-primary hover:text-white"
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
