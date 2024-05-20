<script lang="ts">
  import * as Table from "$lib/components/ui/table";
  import * as Card from "$lib/components/ui/card/index.js";

  import Input from "$lib/components/ui/input/input.svelte";
  import Search from "lucide-svelte/icons/search";
  import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte";

  import type { Request } from "./typeRequest";
    import RequestTableEntry from "./RequestTableEntry.svelte";

  export let requests: Request[];
  let searchTerm: string = "";
  let filteredRequests: Request[] = [];

  $: {
    filteredRequests = requests.filter((request: Request) => {
      for (const key in request) {
        const userKey = key as keyof Request;
        if (
          String(request[userKey])
            .toLowerCase()
            .includes(searchTerm.trim().toLowerCase())
        ) {
          return request;
        }
      }
      return null;
    });
  }

  
</script>

<Card.Root>
  <Card.Header
    class="flex flex-col px-7 align-middle md:flex-row md:items-center md:justify-between"
  >
    <div class="space-y-2">
      <Card.Title>Requests</Card.Title>
      <Card.Description>List of discontinued requests</Card.Description>
    </div>
    <div class="flex flex-row items-center space-x-4 space-y-0 align-middle">
      <div class="relative w-80">
        <Search
          class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
        />
        <Input
          type="search"
          placeholder="Search User"
          class="w-full rounded-lg bg-background pl-8"
          bind:value={searchTerm}
        />
      </div>
    </div>
  </Card.Header>
  <Card.Content class="px-6 text-sm">
    <Table.Root>
      <Table.Caption
        >Showing {filteredRequests.length}
        {filteredRequests.length === 1 ? "result" : "results"}.</Table.Caption
      >
      <Table.Header>
        <Table.Row class="auto-rows grid w-full grid-cols-12 text-left">
          <Table.Head class="col-span-1 grid items-center"></Table.Head>
          <Table.Head class="col-span-2 grid items-center">Student Name</Table.Head>
          <Table.Head class="col-span-2 grid items-center"
            >Student Number</Table.Head
          >
          <Table.Head class="col-span-2 grid items-center"
            >Student Email</Table.Head
          >
          <Table.Head class="col-span-2 grid items-center">Purpose</Table.Head>
          <Table.Head class="col-span-2 grid items-center">Remarks</Table.Head>
          <Table.Head class="col-span-1 hidden items-center">Actions</Table.Head
          >
        </Table.Row>
      </Table.Header>
      <ScrollArea class="h-[28rem]">
        <Table.Body>
          {#each filteredRequests as request}
            <RequestTableEntry {request}/>
          {/each}
        </Table.Body>
      </ScrollArea>
    </Table.Root>
  </Card.Content>
</Card.Root>
