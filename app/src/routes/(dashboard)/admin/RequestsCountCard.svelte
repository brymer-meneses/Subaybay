<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import Progress from "$lib/components/ui/progress/progress.svelte";

  import Check from "lucide-svelte/icons/check";
  import CircleX from "lucide-svelte/icons/circle-x";
  import Hourglass from "lucide-svelte/icons/hourglass";

  export let s: summary;

  let percentage: number =
    s.count === 0 ? 0 : (s.countThisMonth / (s.count - s.countThisMonth)) * 100;
</script>

<Card.Root>
  <Card.Header
    class="flex flex-row items-center justify-between space-y-0 pb-2"
  >
    {#if s.type !== "Pending"}
      <Card.Title class="text-sm font-medium"
        >Total {s.type} Requests</Card.Title
      >
    {:else}
      <Card.Title class="text-sm font-medium"
        >Current {s.type} Requests</Card.Title
      >
    {/if}
    {#if s.type === "Finished"}
      <Check class=" h-4 w-4 text-green-700" />
    {:else if s.type === "Stale"}
      <CircleX class="h-4 w-4 text-red-600" />
    {:else if s.type === "Pending"}
      <Hourglass class="h-4 w-4 text-yellow-600" />
    {/if}
  </Card.Header>
  <Card.Content>
    <div class="text-2xl font-bold">{s.count}</div>
    {#if s.type === "Finished"}
      <p class="text-muted-foreground mb-4 text-xs">
        +{percentage === Infinity ? s.countThisMonth : percentage + "%"} this month
      </p>
    {:else if s.type === "Pending"}
      <p class="text-muted-foreground text-xs">ongoing requests</p>
    {:else if s.type === "Stale"}
      <p class="text-muted-foreground text-xs">stale requests</p>
    {/if}
  </Card.Content>
</Card.Root>
