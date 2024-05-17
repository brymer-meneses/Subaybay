<script lang="ts">
  import { goto } from "$app/navigation";
  import type { PageData, PageServerData } from "./$types.js";

  import * as Tabs from "$lib/components/ui/tabs/index.js";
  import UserManagement from "./UserManagement.svelte";

  export let data: PageServerData;
  export let form: PageData;

  let users = [...data.users].sort(compare);
  let admins = users.filter((e) => e.isAdmin);

  $: {
    users = form
      ? [...form.users].sort(compare)
      : [...data.users].sort(compare);
    admins = users.filter((e) => e.isAdmin);
  }

  function compare(a: any, b: any) {
    if (a.isAdmin > b.isAdmin) return -1;
    if (a.isAdmin < b.isAdmin) return 1;
    return 0;
  }
</script>

<main class="mx-8 flex flex-col space-y-4">
  <Tabs.Root value="users" class="w-full">
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
    <Tabs.Content value="users" class="pt-4">
      <UserManagement bind:users />
    </Tabs.Content>
  </Tabs.Root>
</main>
