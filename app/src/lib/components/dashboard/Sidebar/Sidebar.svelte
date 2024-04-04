<script lang="ts">
  import {
    BxsInbox,
    BxsFileDoc,
    BxsCog,
    BxsLogOut,
    BxsLockOpen,
  } from "svelte-boxicons";

  import UpLogo from "$lib/assets/UP.png";
  import NavLink from "./NavLink.svelte";

  import { Inbox, ListTodo, Settings, UserRoundCog } from "lucide-svelte";
  import { page } from "$app/stores";

  // afterUpdate(() => {
  //   console.log(width);
  // });

  let width: number;

  $: collapsed = width < 200;
</script>

<div
  class="white flex flex-col items-center justify-between h-full w-full py-10"
>
  <div class="flex flex-col gap-y-16 w-full items-center justify-center">
    <div class="w-full items-center justify-start flex-row flex gap-4 p-4">
      <img alt="up logo" src={UpLogo} class="w-10 aspect-square" />
      <h1 class="text-2xl font-poppins">Subaybay</h1>
    </div>
    <nav class="flex flex-col w-full gap-1">
      <NavLink href="/dashboard/inbox" name="Inbox" icon={Inbox} />

      <NavLink
        href="/dashboard/request-tracker"
        name="Request Tracker"
        icon={ListTodo}
      />

      <NavLink
        href="/dashboard/configuration"
        name="Configuration"
        icon={Settings}
      />

      {#if $page.data.userInfo.isAdmin}
        <NavLink
          href="/dashboard/admin"
          name="Admin Configuration"
          icon={UserRoundCog}
        />
      {/if}
    </nav>
  </div>

  <form method="POST" action="/auth/logout">
    <button
      type="submit"
      class="flex items-center justify-center w-full hover:bg-pale-red-100 gap-2 bg-pale-red-200 p-4 rounded-xl"
    >
      <BxsLogOut size="20" /> Logout
    </button>
  </form>
</div>
