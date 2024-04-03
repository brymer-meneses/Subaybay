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
</script>

<section
  class="basis-1/5 white flex flex-col items-center justify-between h-full w-full py-10"
>
  <div class="flex flex-col gap-y-16 w-full items-center justify-center">
    <img alt="up logo" src={UpLogo} class="w-40 aspect-square" />

    <nav class="flex flex-col w-full">
      <NavLink href="/inbox">
        <BxsInbox size="15" />
        <p class="text-sm">Inbox</p>
      </NavLink>

      <NavLink href="/request-tracker">
        <BxsFileDoc size="15" />
        <p class="text-sm">Request Tracker</p>
      </NavLink>

      <NavLink href="/configuration">
        <BxsCog size="15" />
        <p class="text-sm">Configuration</p>
      </NavLink>

      <NavLink href="/admin-configuration">
        <BxsLockOpen size="15" />
        <p class="text-sm">Admin Configuration</p>
      </NavLink>
    </nav>
  </div>

  <form method="POST" action="/logout">
    <button
      type="submit"
      class="flex items-center justify-center w-full hover:bg-pale-red-100 gap-2 bg-pale-red-200 p-4 rounded-xl"
    >
      <BxsLogOut size="20" /> Logout
    </button>
  </form>
</section>
