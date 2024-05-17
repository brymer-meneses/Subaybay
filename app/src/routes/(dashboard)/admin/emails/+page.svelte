<script lang="ts">
  /**
   * TODO: Reactive Components. Form (returned object) is not being retrieved by admin/emails
   */
  import { goto } from "$app/navigation";
  import type { PageData, PageServerData } from "./$types.js";

  import * as Tabs from "$lib/components/ui/tabs/index.js";
  import EmailManagement from "./EmailManagement.svelte";

  export let data: PageServerData;
  export let form: PageServerData;
  let permittedEmails: PermittedEmail[] = [];

  $: permittedEmails = form ? form.permittedEmails : data.permittedEmails;
</script>

<main class="mx-8 flex flex-col space-y-4">
  <Tabs.Root value="emails" class="w-full">
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
    <Tabs.Content value="emails" class="pt-4">
      <EmailManagement bind:emails={permittedEmails} />
    </Tabs.Content>
  </Tabs.Root>
</main>
