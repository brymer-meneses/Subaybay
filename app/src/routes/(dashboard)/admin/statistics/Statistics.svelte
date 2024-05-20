<script lang="ts">
  import {
    type Summary,
    type RequestTypeInstancesCount,
    type RequestType,
    type Request,
  } from "./types";

  import { goto } from "$app/navigation";

  import * as Card from "$lib/components/ui/card/index";
  import Button from "$lib/components/ui/button/button.svelte";
  import Input from "$lib/components/ui/input/input.svelte";

  import RequestsSummaryTable from "./RequestsSummaryTable.svelte";
  import DownloadReport from "./DownloadReport.svelte";

  import Plus from "lucide-svelte/icons/plus";
  import Search from "lucide-svelte/icons/search";

  export let count: RequestTypeInstancesCount[];
  export let summary: Summary[];
  export let requests: Request[];
  export let reqTypes: RequestType[];

  let searchTerm: string = "";
  let filteredReqTypes: RequestTypeInstancesCount[] = [];

  $: {
    filteredReqTypes = count.filter((reqType: RequestTypeInstancesCount) => {
      if (
        reqType.reqTitle.toLowerCase().includes(searchTerm.trim().toLowerCase())
      ) {
        return reqType;
      }
    });
  }
</script>

<Card.Root>
  <Card.Header
    class="flex flex-col align-middle md:flex-row md:items-center md:justify-between"
  >
    <Card.Title class="text-xl font-bold">Request Types Statistics</Card.Title>
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
    <RequestsSummaryTable count={filteredReqTypes} />
  </Card.Content>
  <Card.Footer class="">
    <DownloadReport {count} {reqTypes} {requests} {summary} />
  </Card.Footer>
</Card.Root>
