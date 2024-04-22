<script lang="ts">
  import RequestsCountCard from "./RequestsCountCard.svelte";
  import RequestTypesCard from "./RequestTypesCard.svelte";
  import Overview from "./Overview.svelte";
  import UserList from "./UserList.svelte";
  import UserTable from "./WhitelistUsers.svelte";
  import UsersRound from "lucide-svelte/icons/users-round";
  import WhitelistForm from "./WhitelistForm.svelte";
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
  export let form;
  let value: string;
  let tab: string = "overview";
  $: tab = value;
</script>

<!-- TODO but Low Priority: Fix Responsiveness of the layout -->
<main class="mx-8 flex flex-col space-y-4">
  <h2 class="flex items-center gap-2 text-3xl font-bold tracking-tight">
    Administrator <UsersRound class="inline h-6 w-6" />
  </h2>
  <Tabs.Root bind:value class="w-full space-y-4">
    <Tabs.List class="grid w-[720px] grid-cols-5 border">
      <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
      <Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
      <Tabs.Trigger value="request-types">Requests</Tabs.Trigger>
      <Tabs.Trigger value="admins">Administrators</Tabs.Trigger>
      <Tabs.Trigger value="whitelist">Whitelisted Users</Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="overview">
      <div class="mr-8 flex justify-between space-x-4">
        <div class="flex flex-grow flex-col space-y-4 pb-4 pt-4">
          <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {#each summary as s}
              <RequestsCountCard {s} />
            {/each}
            <RequestTypesCard bind:tab={value} />
          </div>
          <div class="grid flex-grow gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Overview bind:tab={value} />
          </div>
        </div>
        <div class="space-y-4 pt-4">
          <div>
            <UserList users={data.users} admin={true} bind:tab={value} />
          </div>
          <div>
            <UserList users={data.users} admin={false} bind:tab={value} />
          </div>
        </div>
      </div>
    </Tabs.Content>
    <Tabs.Content value="analytics"
      ><p>
        Do this after client confirms so that design can have statistical
        reports or idk. Im bad at frontend
      </p>
      Put here the statistics that maam ash asked about
      <Button class="gap-2"
        ><Download class="text-muted-foreground h-6 w-6 text-white" /> Report</Button
      >
    </Tabs.Content>
    <Tabs.Content value="request-types"
      ><p>Request types + button to go to config</p>
      <p>List all requests</p>
      <p>Option to mark an ongoing request as stale</p></Tabs.Content
    >
    <Tabs.Content value="admins">
      <Tabs.Root value="list">
        <Tabs.List>
          <Tabs.Trigger value="list">User List</Tabs.Trigger>
          <Tabs.Trigger value="add">Add a user</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="list">
          <UserTable users={data.users.filter((e) => e.isAdmin)} />
        </Tabs.Content>
        <Tabs.Content value="add"
          >Take the list of all users and let the admins pick who they will be
          adding</Tabs.Content
        >
      </Tabs.Root>
    </Tabs.Content>
    <Tabs.Content value="whitelist">
      <UserTable users={data.users} />
    </Tabs.Content>
  </Tabs.Root>
</main>
