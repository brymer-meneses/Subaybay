<script lang="ts">
  import File from "lucide-svelte/icons/file";
  import ListFilter from "lucide-svelte/icons/list-filter";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import * as Tabs from "$lib/components/ui/tabs/index.js";
  import Inbox from "./Inbox.svelte";
  import InboxContent from "./InboxContent.svelte";
  import NewRequest from "./NewRequest.svelte";

  export let data;

  let requestTypes = Object.keys(data.requestTypes).map((key) => {
    return data.requestTypes[key];
  });

  let selectedStage: any = null;

  function selectStage(stage: any) {
    selectedStage = stage;
  }
</script>

<main
  class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-4"
>
  <div class="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
    <div
      class="grid gap-24 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4"
    >
      <NewRequest {requestTypes} />
    </div>
    <Tabs.Root value="pending">
      <div class="flex items-center">
        <Tabs.List>
          <Tabs.Trigger value="pending">Pending</Tabs.Trigger>
          <Tabs.Trigger value="finished">Finished</Tabs.Trigger>
        </Tabs.List>
        <div class="ml-auto flex items-center gap-2">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild let:builder>
              <Button
                variant="outline"
                size="sm"
                class="h-7 gap-1 text-sm"
                builders={[builder]}
              >
                <ListFilter class="h-3.5 w-3.5" />
                <span class="sr-only sm:not-sr-only">Filter</span>
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end">
              <DropdownMenu.Label>Filter by</DropdownMenu.Label>
              <DropdownMenu.Separator />
              <DropdownMenu.CheckboxItem checked>
                Fulfilled
              </DropdownMenu.CheckboxItem>
              <DropdownMenu.CheckboxItem>Declined</DropdownMenu.CheckboxItem>
              <DropdownMenu.CheckboxItem>Refunded</DropdownMenu.CheckboxItem>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
          <Button size="sm" variant="outline" class="h-7 gap-1 text-sm">
            <File class="h-3.5 w-3.5" />
            <span class="sr-only sm:not-sr-only">Export</span>
          </Button>
        </div>
      </div>
      <Tabs.Content value="pending">
        <Inbox type="pending" stages={data.currentStages} onSelectStage={selectStage} />
      </Tabs.Content>
    </Tabs.Root>
  </div>

  <div class="lg:col-span-2">
    <InboxContent bind:selectedStage={selectedStage} requests={data.currentRequests}/>
  </div>
</main>
