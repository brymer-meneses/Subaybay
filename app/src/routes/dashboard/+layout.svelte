<script lang="ts">
  import { BxsInbox, BxsFileDoc, BxsCog, BxsLogOut } from "svelte-boxicons";
  import { goto } from "$app/navigation";

  import UpLogo from "$lib/assets/UP.png";
  import NavLink from "./NavLink.svelte";

  async function signOut() {
    await fetch("api/sessionLogout", {
      method: "POST",
    });

    goto("/");
  }
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

    <button
      on:click={signOut}
      class="flex items-center justify-center w-1/2 hover:bg-pale-red-100 gap-3 bg-pale-red-200 p-3 rounded-xl"
    >
      <BxsLogOut size="20" /> Logout
    </button>
  </section>

  <slot />
</main>
