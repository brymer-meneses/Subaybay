<script lang="ts">
  import * as Tabs from "$lib/components/ui/tabs";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Button } from "$lib/components/ui/button";
  import { Separator } from "$lib/components/ui/separator";
  import { Footer } from "$lib/components/ui/table";
</script>

<main class="flex m-5 border-2 border-green-400">
  <div class="basis-1/2">
    <Tabs.Root value="active">
      <Tabs.List
        class="rounded-t-xl rounded-b-none font-inter font-bold gap-2 bg-secondary-200"
      >
        <Tabs.Trigger
          value="active"
          class="rounded-full data-[state=active]:bg-primary data-[state=active]:text-secondary-100 data-[state=inactive]:text-primary"
        >
          Active
        </Tabs.Trigger>
        <Tabs.Trigger
          value="pending"
          class="rounded-full data-[state=active]:bg-primary data-[state=active]:text-secondary-100 data-[state=inactive]:text-primary"
        >
          Pending
        </Tabs.Trigger>
        <Tabs.Trigger
          value="completed"
          class="rounded-full data-[state=active]:bg-primary data-[state=active]:text-secondary-100 data-[state=inactive]:text-primary"
        >
          Completed
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="active" class="mt-0">
        <div class="border-2 border-secondary-200 pr-4 px-2 py-2">
          <!-- TO DO: make into components, make card clickable -->
          <Card.Root class="border-none bg-secondary-200">
            <Card.Header>
              <Card.Title>Request Name</Card.Title>
              <Separator class="bg-primary" />
              <Card.Description>Request Description</Card.Description>
            </Card.Header>
          </Card.Root>
        </div>
      </Tabs.Content>
    </Tabs.Root>
  </div>
  <div class="basis-1/2">
    <div class="border-l-0 border-2 border-secondary-200 mt-10 px-1 py-2">
      <Card.Root class="border-none bg-secondary-200">
        <Card.Header class="pb-4">
          <Card.Title>Request Name</Card.Title>
        </Card.Header>
        <Card.Content>
          Details:
          <Card.Root class="border-none bg-secondary-100 shadow-none">
            <Card.Content class="p-2">Put more details here.</Card.Content>
          </Card.Root>
        </Card.Content>

        <Card.Content>
          Progress:
          <Card.Root class="border-none bg-secondary-100 shadow-none">
            <Card.Content class="p-2">
              Put progress component here.
            </Card.Content>
          </Card.Root>
        </Card.Content>

        <Card.Content>
          Remarks:
          <Card.Root class="border-none bg-secondary-100 shadow-none">
            <Card.Content class="p-2">Put remarks here.</Card.Content>
          </Card.Root>
        </Card.Content>
        <Card.Footer><Button>Send</Button></Card.Footer>
      </Card.Root>
    </div>
  </div>
</main>
