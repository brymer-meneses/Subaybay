<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import BadgeCheck from "lucide-svelte/icons/badge-check";
  import CircleX from "lucide-svelte/icons/circle-x";
  import Hourglass from "lucide-svelte/icons/hourglass";

  type summary = {
    type: string;
    count: number;
  };
  export let s: summary;
</script>

<Card.Root>
  <Card.Header
    class="flex flex-row items-center justify-between space-y-0 pb-2"
  >
    <Card.Title class="text-sm font-medium">Total {s.type} Requests</Card.Title>
    {#if s.type === "Finished"}
      <BadgeCheck class="text-muted-foreground h-6 w-6 text-green-600" />
    {:else if s.type === "Stale"}
      <CircleX class="text-muted-foreground h-6 w-6 text-red-600" />
    {:else if s.type === "Pending"}
      <Hourglass class="text-muted-foreground h-6 w-6 text-yellow-600" />
    {/if}
  </Card.Header>
  <Card.Content>
    <div class="text-2xl font-bold">{s.count}</div>
    <p class="text-muted-foreground text-xs">+20.1% from last month</p>
  </Card.Content>
</Card.Root>
