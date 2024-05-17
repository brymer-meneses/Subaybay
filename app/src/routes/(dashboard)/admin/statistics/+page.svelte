<script lang="ts">
  import { goto } from "$app/navigation";
  import type { PageServerData } from "./$types.js";

  import * as Tabs from "$lib/components/ui/tabs/index.js";
  import Statistics from "./Statistics.svelte";

  export let data: PageServerData;
</script>

<main class="mx-8 flex flex-col space-y-4">
  <Tabs.Root value="stats" class="w-full">
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
    <Tabs.Content value="stats" class="pt-4">
      <Statistics
        count={data.stats.count}
        summary={data.stats.summary}
        requests={data.stats.requests}
        reqTypes={data.stats.requestTypes}
      />
    </Tabs.Content>
  </Tabs.Root>
</main>
