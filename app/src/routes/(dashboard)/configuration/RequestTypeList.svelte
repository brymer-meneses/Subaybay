<script lang="ts">
  import { goto } from "$app/navigation";
  import * as Card from "$lib/components/ui/card";
  import Input from "$lib/components/ui/input/input.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { ScrollArea } from "$lib/components/ui/scroll-area";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import type { RequestType } from "$lib/server/database";
  import Search from "lucide-svelte/icons/search";
  export let requestTypes: RequestType[];

  let filteredRequestTypes: typeof requestTypes = [];
  let searchTerm = "";

  $: filteredRequestTypes = requestTypes.filter((rt) => {
    if (rt.title.toLowerCase().includes(searchTerm.toLowerCase())) return rt;
  });
</script>

<!--Todo layout-->
<Card.Root class="w-[30rem] border ">
  <Card.Header>
    <Card.Title>Request Types</Card.Title>
    <Card.Description
      >Click on any request type to view details.</Card.Description
    >
    <div class="flex flex-row items-center space-x-4 space-y-0 align-middle">
      <div class="relative w-full">
        <Search
          class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
        />
        <Input
          type="search"
          placeholder="Search..."
          class="w-full rounded-lg bg-background pl-8"
          bind:value={searchTerm}
        />
      </div>
    </div>
  </Card.Header>
  <Card.Content>
    <p class="mb-4 text-sm text-muted-foreground">
      Returned {filteredRequestTypes.length}
      {filteredRequestTypes.length <= 1 ? "result" : "results"}.
    </p>
    {#if filteredRequestTypes.length > 0}
      <ScrollArea class="flex h-[560px] flex-col">
        {#each filteredRequestTypes as requestType}
          <Button
            variant="link"
            on:click={() => {
              goto(`./configuration/${requestType._id}`);
            }}
            class="block"
          >
            {requestType.title}
          </Button>
          <Separator />
        {/each}
      </ScrollArea>
    {/if}
  </Card.Content>
</Card.Root>
