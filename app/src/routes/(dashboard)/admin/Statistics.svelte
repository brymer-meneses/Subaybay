<script lang="ts">
  import { goto } from "$app/navigation";

  import * as Card from "$lib/components/ui/card/index";
  import Button from "$lib/components/ui/button/button.svelte";
  import Input from "$lib/components/ui/input/input.svelte";

  import RequestsSummaryTable from "./RequestsSummaryTable.svelte";

  import Download from "lucide-svelte/icons/download";
  import Plus from "lucide-svelte/icons/plus";
  import Search from "lucide-svelte/icons/search";

  let searchTerm: string = "";
</script>

<Card.Root>
  <Card.Header class="flex flex-row items-center justify-between align-middle">
    <Card.Title class="text-xl font-bold">Requst Types Statistics</Card.Title>
    <div class="flex flex-row items-center space-x-4 space-y-0 align-middle">
      <div class="relative w-80">
        <Search
          class="text-muted-foreground absolute left-2.5 top-2.5 h-4 w-4"
        />
        <Input
          type="search"
          placeholder="Search Request Types..."
          class="bg-background w-full rounded-lg pl-8"
          bind:value={searchTerm}
        />
      </div>
      <div class="w-36">
        <Button
          on:click={() => {
            goto("../configuration");
          }}><Plus size="20" />Request Type</Button
        >
      </div>
    </div>
  </Card.Header>
  <Card.Content>
    <RequestsSummaryTable />
  </Card.Content>
  <Card.Footer class="">
    <Button variant="outline" class="gap-2">
      <Download class="text-muted-foreground h-6 w-6" />
      Report
    </Button>
  </Card.Footer>
</Card.Root>
