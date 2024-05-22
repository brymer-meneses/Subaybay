<script lang="ts">
  import {
    sortPendingNewest,
    sortPendingOldest,
    sortFinishedNewest,
    sortFinishedOldest,
  } from "./sortingFunctions";
  import * as Table from "$lib/components/ui/table";
  import * as Card from "$lib/components/ui/card/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";

  import Input from "$lib/components/ui/input/input.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Search from "lucide-svelte/icons/search";
  import ChevronDown from "lucide-svelte/icons/chevron-down";
  import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte";

  import type { Request } from "$lib/server/database";
  import RequestTableEntry from "./RequestTableEntry.svelte";

  export let requests: Request[];
  export let classification: string;

  let searchTerm: string = "";
  let filteredRequests: Request[] = [];
  let sortBy: string = "Newest";

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

    if (classification === "pending" || classification === "discontinued") {
      if (sortBy === "Newest")
        filteredRequests = filteredRequests.sort(sortPendingNewest);
      else if (sortBy === "Oldest")
        filteredRequests = filteredRequests.sort(sortPendingOldest);
    } else if (classification === "finished") {
      if (sortBy === "Newest")
        filteredRequests = filteredRequests.sort(sortFinishedNewest);
      else if (sortBy === "Oldest")
        filteredRequests = filteredRequests.sort(sortFinishedOldest);
    }
  }
</script>

<Card.Root>
  <Card.Header
    class="flex flex-col px-7 align-middle md:flex-row md:items-center md:justify-between"
  >
    <div class="space-y-2">
      <Card.Title>Requests</Card.Title>
      <Card.Description>List of requests</Card.Description>
    </div>
    <div class="flex flex-row items-center space-x-4 space-y-0 align-middle">
      <div>
        <span class="mr-2">Sort:</span>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Button variant="outline" class="pr-0"
              >{sortBy} <ChevronDown class="mx-2" /></Button
            >
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Label>Sort By</DropdownMenu.Label>
            <DropdownMenu.Separator />
            <DropdownMenu.RadioGroup bind:value={sortBy}>
              <DropdownMenu.RadioItem value={"Newest"}
                >Newest</DropdownMenu.RadioItem
              >
              <DropdownMenu.RadioItem value={"Oldest"}
                >Oldest</DropdownMenu.RadioItem
              >
            </DropdownMenu.RadioGroup>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
      <div class="relative w-80">
        <Search
          class="text-muted-foreground absolute left-2.5 top-2.5 h-4 w-4"
        />
        <Input
          type="search"
          placeholder="Search User"
          class="bg-background w-full rounded-lg pl-8"
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
          <Table.Head class="col-span-1 grid items-center"
            >Student Number</Table.Head
          >
          <Table.Head class="col-span-1 grid items-center"
            >Student Name</Table.Head
          >
          <Table.Head class="col-span-2 grid items-center"
            >Student Email</Table.Head
          >
          <Table.Head class="col-span-1 grid items-center"
            >Number of Copies</Table.Head
          >
          <Table.Head class="col-span-2 grid items-center">Purpose</Table.Head>
          <Table.Head class="col-span-2 grid items-center">Remarks</Table.Head>
          <Table.Head class="col-span-2 hidden items-center">Actions</Table.Head
          >
        </Table.Row>
      </Table.Header>
      <ScrollArea class="h-[28rem]">
        <Table.Body>
          {#each filteredRequests as request, index}
            <RequestTableEntry {request} {index} />
          {/each}
        </Table.Body>
      </ScrollArea>
    </Table.Root>
  </Card.Content>
</Card.Root>
