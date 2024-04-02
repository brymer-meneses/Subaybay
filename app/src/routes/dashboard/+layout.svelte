<script lang="ts">
  import { BxsInbox, BxsFileDoc, BxsCog, BxsLogOut } from "svelte-boxicons";

  import UpLogo from "$lib/assets/UP.png";
  import NavLink from "./NavLink.svelte";
</script>

<main class="h-screen w-screen flex bg-background">
  <section
    class="basis-1/5 white flex flex-col items-center justify-between h-full w-full py-10"
  >
    <div class="flex flex-col gap-y-16 w-full items-center justify-center">
      <img alt="up logo" src={UpLogo} class="w-40 aspect-square" />

      <nav class="flex flex-col w-full">
        <NavLink href="/">
          <BxsInbox size="20" /> Inbox
        </NavLink>

        <NavLink href="/">
          <BxsFileDoc size="20" /> Requests
        </NavLink>

        <NavLink href="/">
          <BxsCog size="20" /> Settings
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

  <slot />
</main>
