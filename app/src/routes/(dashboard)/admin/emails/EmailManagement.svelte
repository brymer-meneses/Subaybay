<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import Input from "$lib/components/ui/input/input.svelte";

  import Search from "lucide-svelte/icons/search";
  import AddUser from "./AddUser.svelte";
  import EmailTable from "./EmailTable.svelte";

  export let emails: PermittedEmail[];

  let searchTerm: string = "";
  let filteredEmails: PermittedEmail[] = [];

  $: {
    filteredEmails = emails.filter((email: PermittedEmail) => {
      if (
        String(email.email)
          .toLowerCase()
          .includes(searchTerm.trim().toLowerCase())
      ) {
        return email;
      }
    });
  }
</script>

<Card.Root>
  <Card.Header
    class="flex flex-col align-middle md:flex-row md:items-center md:justify-between"
  >
    <Card.Title class="text-xl font-bold">Manage Emails</Card.Title>
    <div class="flex flex-row items-center space-x-4 space-y-0 align-middle">
      <div class="relative w-80">
        <Search
          class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
        />
        <Input
          type="search"
          placeholder="Search User"
          class="w-full rounded-lg bg-background pl-8"
          bind:value={searchTerm}
        />
      </div>
      <div class="">
        <AddUser />
      </div>
    </div>
  </Card.Header>
  <Card.Content>
    <EmailTable bind:emails={filteredEmails} />
  </Card.Content>
</Card.Root>
