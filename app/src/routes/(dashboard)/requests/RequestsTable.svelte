<script lang="ts" context="module">
  import type { Request } from "$lib/server/database";

  export type RequestSearchItem = Request & {
    requestTitle: string;
    date: string;
  };
</script>

<script lang="ts">
  import { page } from "$app/stores";
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

  import RequestTableEntry from "./RequestTableEntry.svelte";

  export let requests: Request[];
  export let classification: "pending" | "finished" | "discontinued";

  let searchTerm: string = "";
  let searchItems: RequestSearchItem[] = [];
  let filteredRequests: RequestSearchItem[] = [];
  let sortBy: string = "Newest";

  $: {
    searchItems = requests.map((r) => {
      let date: string = "";
      if (!r.isFinished) {
        date =
          r.history.length > 0
            ? r.history[0].dateStarted.toLocaleString()
            : r.currentStage.dateStarted.toLocaleString();
      } else {
        const stageTypeIndex = r.currentStage.stageTypeIndex;
        const requestType = $page.data.requestTypes.find(
          (rt: RequestType) => rt._id === r.requestTypeId,
        );
        if (requestType) {
          const lastStageIndex = requestType?.stages.length - 1;
          if (stageTypeIndex <= lastStageIndex && !r.currentStage.finished) {
            date =
              r.history.length > 0
                ? r.history[0].dateStarted.toLocaleString()
                : r.currentStage.dateStarted.toLocaleString();
          } else {
            date = r.currentStage.dateFinished.toLocaleString();
          }
        }
      }
      return {
        ...r,
        requestTitle:
          $page.data.requestTypes.find(
            (rt: RequestType) => rt._id === r.requestTypeId,
          )?.title || "",
        date: date,
      };
    });

    filteredRequests = searchItems.filter((request: RequestSearchItem) => {
      for (const key in request) {
        const userKey = key as keyof RequestSearchItem;
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
          placeholder="Search..."
          class="bg-background w-full rounded-lg pl-8"
          bind:value={searchTerm}
        />
      </div>
    </div>
  </Card.Header>
  <Card.Content class=" px-6 text-sm">
    <Table.Root>
      <Table.Caption
        >Showing {filteredRequests.length}
        {filteredRequests.length === 1 ? "result" : "results"}.</Table.Caption
      >
      <Table.Header>
        <Table.Row class="auto-rows grid w-full grid-cols-12 text-left">
          <Table.Head class="col-span-1"></Table.Head>
          <Table.Head class="col-span-1 grid items-center p-0"
            >Student Num.</Table.Head
          >
          <Table.Head class="col-span-2 grid items-center"
            >Student Name</Table.Head
          >
          <Table.Head class="col-span-2 grid items-center"
            >Student Email</Table.Head
          >
          <Table.Head class="col-span-2 grid items-center"
            >Request Type</Table.Head
          >
          <Table.Head class="col-span-1 grid items-center">Copies</Table.Head>
          {#if classification !== "finished"}
            <Table.Head class="col-span-2 grid items-center">
              Date Requested
            </Table.Head>
          {:else}
            <Table.Head class="col-span-2 grid items-center">
              Date Completed
            </Table.Head>
          {/if}
          <Table.Head class="col-span-1 hidden items-center">Actions</Table.Head
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
