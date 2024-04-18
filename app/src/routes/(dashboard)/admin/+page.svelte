<script lang="ts">
  import RequestsCountCard from "./RequestsCountCard.svelte";
  import Overview from "./Overview.svelte";
  import UserList from "./UserList.svelte";

  const summary = [
    { type: "Finished", count: 37 },
    { type: "Pending", count: 154 },
    { type: "Stale", count: 7 },
  ];

  export let data;
</script>

<!-- TODO: Fix Responsiveness of the layout -->
<main class="mx-8 flex flex-col space-y-4">
  <h2 class="text-3xl font-bold tracking-tight">Administrator</h2>
  <div class="mr-8 flex justify-between space-x-4">
    <div class="flex flex-grow flex-col space-y-4 pb-4 pt-4">
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {#each summary as s}
          <RequestsCountCard {s} />
        {/each}
      </div>
      <div class="grid flex-grow gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Overview />
      </div>
    </div>
    <div class="space-y-4 pt-4">
      <div>
        <UserList users={data.users} admin={true} />
      </div>
      <div>
        <UserList users={data.users} admin={false} />
      </div>
    </div>
  </div>
</main>
