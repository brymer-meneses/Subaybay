<script lang="ts">
  // https://github.com/himynameisdave/svelte-frappe-charts
  import * as Card from "$lib/components/ui/card/index.js";
  import { Button } from "$lib/components/ui/button/index.js";

  export let tab: string;

  let value: string = "stats";

  const onClickHandler = (value: string) => {
    tab = value;
  };
</script>

<Card.Root class="col-span-full flex h-full flex-col justify-between space-y-2">
  <Card.Header>
    <Card.Title>Overview</Card.Title>
    <Card.Description>Last 7 working days</Card.Description>
  </Card.Header>
  <Card.Content class=" flex grow items-center justify-center  text-3xl"
    >Graph here</Card.Content
  >
  <Card.Footer class="flex justify-end gap-4">
    <Button class="gap-1 p-4" on:click={() => onClickHandler(value)}
      >View Statistics</Button
    >
  </Card.Footer>
</Card.Root>
