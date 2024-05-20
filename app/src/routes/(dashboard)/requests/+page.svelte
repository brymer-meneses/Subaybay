<script lang="ts">
  import * as Tabs from "$lib/components/ui/tabs";
  import RequestsTable from "./RequestsTable.svelte";

  export let data;

  const activeRequests = data.activeRequests;
  const finishedRequests = data.finishedRequests;
  const staleRequests = data.staleRequests;
</script>

<main class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
  <div class="grid flex-1 auto-rows-max items-start gap-4">
    <Tabs.Root value="pending">
      <Tabs.List>
        <Tabs.Trigger value="pending">Pending</Tabs.Trigger>
        <Tabs.Trigger value="finished">Finished</Tabs.Trigger>
        <Tabs.Trigger value="discontinued">Discontinued</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="pending">
          <RequestsTable requests={activeRequests}/>
      </Tabs.Content>
      <Tabs.Content value="finished">
        <RequestsTable requests={finishedRequests}/>
      </Tabs.Content>
      <Tabs.Content value="discontinued">
        <RequestsTable requests={staleRequests}/>
      </Tabs.Content>
    </Tabs.Root>
  </div>
</main>
