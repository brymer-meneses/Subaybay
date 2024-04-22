<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  // import File from "lucide-svelte/icons/file-type-2";

  export let tab: string;
  let value: string = "request-types";
  const onClickHandler = (value: string) => {
    tab = value;
  };
</script>

<Card.Root>
  <Card.Header
    class="flex flex-row items-center justify-between space-y-0 pb-2 "
  >
    <Card.Title class="text-sm font-medium">Requests</Card.Title>
    <!-- <File /> -->
  </Card.Header>
  <Card.Content>
    <p class="text-muted-foreground text-xs">View all requests</p>
  </Card.Content>
  <Card.Footer class="float-end">
    <Button
      variant="outline"
      class="gap-2 text-[#112]"
      on:click={() => onClickHandler(value)}>View</Button
    >
  </Card.Footer>
</Card.Root>
