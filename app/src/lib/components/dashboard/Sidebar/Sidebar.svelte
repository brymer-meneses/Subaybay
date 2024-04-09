<script lang="ts">
  import { BxsLogOut } from "svelte-boxicons";

  import UpLogo from "$lib/assets/UP.png";
  import NavLink from "./NavLink.svelte";
  import { Menu } from "lucide-svelte";

  import * as Resizable from "$lib/components/ui/resizable/index.js";

  import { Inbox, ListTodo, Settings, UserRoundCog } from "lucide-svelte";
  import { page } from "$app/stores";

  import type { PaneAPI } from "paneforge";

  let width: number;
  let pane: PaneAPI;

  $: isExpanded = width >= 150;

  // function menuOnClick() {
  //   if (pane.isExpanded()) {
  //     pane.collapse();
  //   } else {
  //     pane.expand();
  //   }
  //
  //   console.log("run!");
  // }
</script>

<Resizable.Pane bind:pane defaultSize={5} maxSize={20} minSize={5}>
  <div
    bind:clientWidth={width}
    class="white flex flex-col items-center justify-between h-full w-full py-10"
  >
    <div class="flex flex-col gap-y-16 w-full items-center justify-center">
      <div class="w-full items-center justify-start flex-col flex gap-4">
        <div class="flex flex-row gap-4 items-center justify-start w-full px-5">
          <img alt="up logo" src={UpLogo} class="w-10 aspect-square" />

          {#if isExpanded}
            <h1 class="text-2xl font-poppins">Subaybay</h1>
          {/if}
        </div>
      </div>
      <nav class="flex flex-col w-full gap-1">
        <NavLink
          {isExpanded}
          href="/dashboard/inbox"
          name="Inbox"
          icon={Inbox}
        />

        <NavLink
          {isExpanded}
          href="/dashboard/request-tracker"
          name="Request Tracker"
          icon={ListTodo}
        />

        <NavLink
          {isExpanded}
          href="/dashboard/configuration"
          name="Configuration"
          icon={Settings}
        />

        {#if $page.data.userInfo.isAdmin}
          <NavLink
            {isExpanded}
            href="/dashboard/admin"
            name="Admin Configuration"
            icon={UserRoundCog}
          />
        {/if}
      </nav>
    </div>

    {#if !isExpanded}
      <p class="[writing-mode:vertical-lr] font-poppins font-bold">Subaybay</p>
    {/if}

    <form method="POST" action="/auth/logout">
      <button
        type="submit"
        class="flex items-center justify-center w-full hover:bg-pale-red-100 gap-2 bg-pale-red-200 p-4 rounded-xl"
      >
        <BxsLogOut size="20" class="text-pale-red-500" />

        {#if isExpanded}
          <p class="text-pale-red-500">Logout</p>
        {/if}
      </button>
    </form>
  </div>
</Resizable.Pane>
