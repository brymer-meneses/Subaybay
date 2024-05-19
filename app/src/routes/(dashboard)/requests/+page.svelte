<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
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
        <Card.Root>
          <Card.Header class="px-7">
            <Card.Title>Requests</Card.Title>
            <Card.Description>List of pending requests</Card.Description>
          </Card.Header>
          <Card.Content class="px-6 text-sm">
            <RequestsTable requests={activeRequests} />
          </Card.Content>
        </Card.Root>
      </Tabs.Content>
      <Tabs.Content value="finished">
        <Card.Root>
          <Card.Header class="px-7">
            <Card.Title>Requests</Card.Title>
            <Card.Description>List of finished requests</Card.Description>
          </Card.Header>
          <Card.Content class="px-6 text-sm">
            <RequestsTable requests={finishedRequests} />
          </Card.Content>
        </Card.Root>
      </Tabs.Content>
      <Tabs.Content value="discontinued">
        <Card.Root>
          <Card.Header class="px-7">
            <Card.Title>Requests</Card.Title>
            <Card.Description>List of discontinued requests</Card.Description>
          </Card.Header>
          <Card.Content class="px-6 text-sm">
            <RequestsTable requests={staleRequests} />
          </Card.Content>
        </Card.Root>
      </Tabs.Content>
    </Tabs.Root>
  </div>
</main>
