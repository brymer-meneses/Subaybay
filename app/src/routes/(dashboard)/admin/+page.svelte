<script lang="ts">
  import RequestsCountCard from "./RequestsCountCard.svelte";
  import RequestCard from "./RequestCard.svelte";
  import Overview from "./Overview.svelte";
  import UserList from "./UserList.svelte";
  import UserManagement from "./UserManagement.svelte";
  import UsersRound from "lucide-svelte/icons/users-round";
  import * as Tabs from "$lib/components/ui/tabs/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import Download from "lucide-svelte/icons/download";
  import type { PageData } from "./$types.js";

  const summary = [
    { type: "Finished", count: 37 },
    { type: "Pending", count: 154 },
    { type: "Stale", count: 7 },
  ];

  export let data: PageData;
  export let form: PageData;

  // Safely copy and sort without mutating the original data.users
  let users = [...data.users].sort(compare);
  let admins = users.filter((e) => e.isAdmin);

  $: {
    users = form
      ? [...form.users].sort(compare)
      : [...data.users].sort(compare);
    admins = users.filter((e) => e.isAdmin);
  }

  let dialogOpen: boolean = false;
  let value: string;
  let tab: string;

  $: tab = value;

  function compare(a: any, b: any) {
    if (a.isAdmin > b.isAdmin) return -1;
    if (a.isAdmin < b.isAdmin) return 1;
    return 0;
  }
</script>

<!-- TODO but Low Priority: Fix Responsiveness of the layout -->
<main class="mx-8 flex flex-col space-y-4">
  <h2 class="flex items-center gap-2 text-3xl font-bold tracking-tight">
    Administrator <UsersRound class="inline h-6 w-6" />
  </h2>
  <Tabs.Root bind:value class="w-full space-y-4">
    <Tabs.List class="grid w-[720px] grid-cols-3 border">
      <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
      <Tabs.Trigger value="stats">Statistics</Tabs.Trigger>
      <Tabs.Trigger value="users">Users</Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="overview">
      <div class="mr-8 flex justify-between space-x-4">
        <div class="flex flex-grow flex-col space-y-4 pb-4 pt-4">
          <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {#each summary as s}
              <RequestsCountCard {s} />
            {/each}
            <RequestCard />
          </div>
          <div class="grid flex-grow gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Overview bind:tab={value} />
          </div>
        </div>
        <div class="my-4 space-y-4">
          <UserList bind:users bind:tab={value} />
        </div>
      </div>
    </Tabs.Content>
    <Tabs.Content value="stats">
      <Button class="gap-2"
        ><Download class="text-muted-foreground h-6 w-6 text-white" /> Report</Button
      >
    </Tabs.Content>
    <Tabs.Content value="users" class="space-y-4">
      <UserManagement bind:users />
    </Tabs.Content>
  </Tabs.Root>
</main>
