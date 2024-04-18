<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import Download from "lucide-svelte/icons/download";
</script>

<Card.Root class="col-span-full flex h-full flex-col justify-between space-y-2">
  <Card.Header>
    <Card.Title>Overview</Card.Title>
    <Card.Description>Jan 2023 - Mar 2024</Card.Description>
  </Card.Header>
  <Card.Content class=" flex grow items-center justify-center  text-3xl"
    >Graph here</Card.Content
  >
  <Card.Footer class="flex justify-end">
    <Button class="w-48 gap-2"
      ><Download class="text-muted-foreground h-6 w-6 text-white" /> Download Report</Button
    >
  </Card.Footer>
</Card.Root>
