<script lang="ts">
  export let message: string;
  export let byYou: boolean;

  const color = byYou ? "bg-pale-yellow-100" : "bg-pale-red-600";
  const position = byYou ? "items-end" : "items-start";
</script>

<div class={`w-full flex flex-col justify-center ${position}`}>
  <div
    class={`rounded-2xl min-w-[30%] w-fit max-w-[80%] p-3 flex items-center ${color}`}
  >
    <p>{message}</p>
  </div>
</div>
