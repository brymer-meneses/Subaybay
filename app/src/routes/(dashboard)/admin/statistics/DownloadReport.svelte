<script lang="ts">
  import { exportExcel } from "./exportExcel";
  import {
    type Summary,
    type RequestTypeInstancesCount,
    type RequestType,
    type Request,
    type Params,
  } from "./types";

  import * as Dialog from "$lib/components/ui/dialog";
  import * as RadioGroup from "$lib/components/ui/radio-group/index.js";
  import Label from "$lib/components/ui/label/label.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import DateRangePicker from "./DateRangePicker.svelte";
  import Download from "lucide-svelte/icons/download";

  export let count: RequestTypeInstancesCount[];
  export let summary: Summary[];
  export let requests: Request[];
  export let reqTypes: RequestType[];

  let sortBy: "date" | "requestType" = "date";
  let sortType: "oldest" | "newest" | "request" = "oldest";
  let startDate: Date = new Date(0);
  let endDate: Date = new Date(0);
  let dateRange: string = "false"; //i tried boolean, but radio group component doesnt allow me
  let params: Params = {
    sortBy,
    sortType,
    startDate,
    endDate,
    dateRange: JSON.parse(dateRange),
  };

  $: {
    if (sortBy === "requestType") {
      sortType = "request";
    }

    if (!JSON.parse(dateRange)) {
      startDate = new Date(0);
      endDate = new Date(0);
    }
    params = {
      sortBy,
      sortType,
      startDate,
      endDate,
      dateRange: JSON.parse(dateRange),
    };
  }

  let statDiagOpen = false;
</script>

<Dialog.Root bind:open={statDiagOpen}>
  <Dialog.Trigger>
    <Button variant="outline" class="gap-2">
      <Download class="text-muted-foreground h-6 w-6" />
      Report
    </Button>
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Download Report</Dialog.Title>
      <Dialog.Description
        >Please set the following parameters.</Dialog.Description
      >
    </Dialog.Header>
    <!-- <p>
      <span class="text-red-600">DEBUG:</span> <br />
      {JSON.stringify(params, null, 2)}
    </p> -->
    <Separator />
    <div class="space-y-8">
      <div class="flex flex-col gap-4">
        <Label>Download all request details during:</Label>
        <RadioGroup.Root bind:value={dateRange} class="flex">
          <div class="flex items-center space-x-2">
            <RadioGroup.Item value={"false"} id="dateRange2" />
            <Label for="dateRange2" class="font-normal">Lifetime</Label>
          </div>
          <div class="flex items-center space-x-2">
            <RadioGroup.Item value={"true"} id="dateRange1" />
            <Label for="dateRange1" class="font-normal">Custom Date Range</Label
            >
          </div>
        </RadioGroup.Root>
      </div>
      {#if JSON.parse(dateRange)}
        <div class="my-4 flex flex-col gap-4">
          <Label>Start Date</Label>
          <DateRangePicker
            on:dateSelect={(event) => {
              startDate = new Date(event.detail);
            }}
          />
          <Label>End Date</Label>
          <DateRangePicker
            on:dateSelect={(event) => {
              if (startDate.getTime() <= new Date(event.detail).getTime()) {
                endDate = new Date(event.detail);
              } else {
                endDate = startDate;
              }
            }}
          />
        </div>
      {/if}
      <div class="flex flex-col gap-4">
        <Label>Sort by:</Label>
        <RadioGroup.Root bind:value={sortBy} class="flex">
          <div class="flex items-center space-x-2">
            <RadioGroup.Item value={"date"} id="sortBy1" />
            <Label for="sortBy1" class="font-normal">Date</Label>
          </div>
          <div class="flex items-center space-x-2">
            <RadioGroup.Item value={"requestType"} id="sortBy2" />
            <Label for="sortBy2" class="font-normal">Request Type</Label>
          </div>
        </RadioGroup.Root>
      </div>
      {#if sortBy === "date"}
        <div class="flex flex-col gap-4">
          <Label>Sort Type:</Label>
          <RadioGroup.Root bind:value={sortType} class="flex">
            <div class="flex items-center space-x-2">
              <RadioGroup.Item value={"oldest"} id="sortType1" />
              <Label for="sortType1" class="font-normal">Oldest first</Label>
            </div>
            <div class="flex items-center space-x-2">
              <RadioGroup.Item value={"newest"} id="sortType2" />
              <Label for="sortType2" class="font-normal">Newest First</Label>
            </div>
          </RadioGroup.Root>
        </div>
      {/if}
    </div>
    <Dialog.Footer>
      {#if (sortBy === "date" && sortType === "request") || ((startDate.getTime() === 0 || endDate.getTime() === 0) && JSON.parse(dateRange))}
        <Button class="gap-2" disabled><Download /> Report</Button>
      {:else}
        <Button
          class="gap-2"
          on:click={() => {
            exportExcel(count, summary, reqTypes, requests, params);
            statDiagOpen = !statDiagOpen;
          }}
        >
          <Download />
          Report
        </Button>
      {/if}
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
