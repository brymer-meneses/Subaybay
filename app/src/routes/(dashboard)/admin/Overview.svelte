<script lang="ts">
  // https://github.com/himynameisdave/svelte-frappe-charts
  import * as Card from "$lib/components/ui/card/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import DataVisualization from "./DataVisualization.svelte";

  export let tab: string;
  export let overviewData: { date: Date; value: number }[];

  let value: string = "stats";

  const onClickHandler = (value: string) => {
    tab = value;
  };
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
    <Button
      class="gap-1 p-4"
      variant="outline"
      on:click={() => onClickHandler(value)}>View Statistics</Button
    >
  </Card.Footer>
</Card.Root>
