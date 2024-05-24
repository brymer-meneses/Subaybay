<script lang="ts">
  import { goto } from "$app/navigation";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import DataVisualization from "./DataVisualization.svelte";

  export let overviewData: { date: Date; value: number }[];
</script>

<Card.Root class="col-span-full flex h-full flex-col justify-between space-y-0">
  <Card.Header>
    <Card.Title>Overview</Card.Title>
    <Card.Description
      >Number of Finished Requests in the last 14 days</Card.Description
    >
  </Card.Header>
  <Card.Content class="mt-4 flex grow">
    <DataVisualization data={overviewData} />
  </Card.Content>
  <Card.Footer class="flex justify-end gap-4 ">
    <Button class="gap-1 p-4" on:click={() => goto("admin/statistics")}
      >View Statistics</Button
    >
  </Card.Footer>
</Card.Root>
