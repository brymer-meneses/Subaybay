<script lang="ts">
  import type { PageData } from "./$types.js";

  import * as Tabs from "$lib/components/ui/tabs/index.js";
  import RequestsCountCard from "./RequestsCountCard.svelte";
  import RequestCard from "./RequestCard.svelte";
  import Overview from "./Overview.svelte";
  import UserList from "./UserList.svelte";
  import Statistics from "./Statistics.svelte";
  import UserManagement from "./UserManagement.svelte";

  import UsersRound from "lucide-svelte/icons/users-round";

  export let data: PageData;
  export let form: PageData;

  const summary = data.stats.summary;

  let users = [...data.users].sort(compare);
  let admins = users.filter((e) => e.isAdmin);

  $: {
    users = form
      ? [...form.users].sort(compare)
      : [...data.users].sort(compare);
    admins = users.filter((e) => e.isAdmin);
  }

  let value: string;
  let tab: string;

  $: tab = value;

  function compare(a: any, b: any) {
    if (a.isAdmin > b.isAdmin) return -1;
    if (a.isAdmin < b.isAdmin) return 1;
    return 0;
  }
</script>

<!-- <p>{JSON.stringify(form) ?? ""}</p> -->
<!-- TODO but Low Priority: Fix Responsiveness of the layout -->
<main class="mx-8 flex flex-col space-y-4">
  <h2 class="flex items-center gap-2 text-3xl font-bold tracking-tight">
    Administrator <UsersRound class="inline h-6 w-6" />
  </h2>
  <Tabs.Root bind:value class="w-full">
    <Tabs.List class="grid w-full grid-cols-3 border lg:w-[720px]">
      <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
      <Tabs.Trigger value="stats">Statistics</Tabs.Trigger>
      <Tabs.Trigger value="users">Users</Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="overview">
      <div class="flex flex-col justify-between lg:flex-row lg:space-x-4">
        <div class="flex flex-grow flex-col space-y-4 pb-4 pt-4">
          <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {#each summary as s}
              <RequestsCountCard {s} />
            {/each}
            <RequestCard />
          </div>
          <div class="grid flex-grow gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Overview bind:tab={value} overviewData={data.stats.overview} />
          </div>
        </div>
        <div class="lg:my-4 lg:space-y-4">
          <UserList bind:users bind:tab={value} />
        </div>
      </div>
    </Tabs.Content>
    <Tabs.Content value="stats" class="pt-4">
      <Statistics
        count={data.stats.count}
        summary={data.stats.summary}
        requests={data.stats.requests}
        reqTypes={data.stats.requestTypes}
      />
    </Tabs.Content>
    <Tabs.Content value="users" class="pt-4">
      <UserManagement bind:users />
    </Tabs.Content>
  </Tabs.Root>
</main>
