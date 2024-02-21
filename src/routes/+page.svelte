<script lang="ts">
  import * as Tabs from "$lib/components/ui/tabs";
  import * as Table from "$lib/components/ui/table";
  import { Separator } from "$lib/components/ui/separator";
</script>

<h1>Employee Dashboard</h1>

<!-- Active and Pending -->
<Tabs.Root value="active" class="w-90">
  <Tabs.List>
    <Tabs.Trigger value="active">Active</Tabs.Trigger>
    <Tabs.Trigger value="pending">Pending</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="active">
<Table.Root>
  <Table.Caption>A list of your recent invoices.</Table.Caption>
  <Table.Header>
    <Table.Row>
      <Table.Head>Code</Table.Head>
      <Table.Head>Name</Table.Head>
      <Table.Head>Times of Request</Table.Head>
      <Table.Head>Mode of Request</Table.Head>
      <Table.Head>Purpose</Table.Head>
      <Table.Head>Requirements</Table.Head>
      <Table.Head>Remarks</Table.Head>
      <Table.Head>Status</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
  </Table.Body>
</Table.Root>

  </Tabs.Content>
  <Tabs.Content value="pending">
    	
    <Table.Root>
      <Table.Caption>A list of your recent invoices.</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.Head>Code</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
      </Table.Body>
    </Table.Root>


  </Tabs.Content>
</Tabs.Root>
<!--  -->
