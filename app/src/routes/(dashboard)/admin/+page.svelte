<script lang="ts">
  import { goto } from "$app/navigation";
  import type { PageData, PageServerData } from "./$types.js";

  import * as Tabs from "$lib/components/ui/tabs/index.js";
  import RequestsCountCard from "./RequestsCountCard.svelte";
  import RequestCard from "./RequestCard.svelte";
  import Overview from "./Overview.svelte";
  import UserList from "./UserList.svelte";

  export let data: PageServerData;
  export let form: PageData;

  const summary = data.stats.summary;

  let users = [...data.users].sort(compare);

  $: {
    users = form
      ? [...form.users].sort(compare)
      : [...data.users].sort(compare);
  }

  function compare(a: any, b: any) {
    if (a.isAdmin > b.isAdmin) return -1;
    if (a.isAdmin < b.isAdmin) return 1;
    return 0;
  }
</script>

<main class="mx-8 flex flex-col space-y-4">
  <Tabs.Root value="overview" class="w-full">
    <Tabs.List class="grid w-full grid-cols-4 border lg:w-[720px]">
      <Tabs.Trigger value="overview" on:click={() => goto("/admin")}
        >Overview</Tabs.Trigger
      >
      <Tabs.Trigger value="stats" on:click={() => goto("/admin/statistics")}
        >Statistics</Tabs.Trigger
      >
      <Tabs.Trigger value="users" on:click={() => goto("/admin/users")}
        >Users</Tabs.Trigger
      >
      <Tabs.Trigger value="emails" on:click={() => goto("/admin/emails")}
        >Emails</Tabs.Trigger
      >
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
            <Overview overviewData={data.stats.overview} />
          </div>
        </div>
        <div class="lg:my-4 lg:space-y-4">
          <UserList bind:users />
        </div>
      </div>
    </Tabs.Content>
  </Tabs.Root>
</main>
