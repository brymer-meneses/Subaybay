<script lang="ts">
  import Sidebar from "./Sidebar.svelte";
  import Header from "./Header.svelte";
  import clsx from "clsx";
  import { onMount } from "svelte";

  let isSidebarCollapsed = true;
  let clientWidth: number;

  $: {
    if (clientWidth < 760) {
      isSidebarCollapsed = true;
    } else if (typeof window !== "undefined") {
      isSidebarCollapsed = JSON.parse(
        sessionStorage.getItem("collapsedSidebar") ?? "true",
      );
    }
  }

  $: {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "collapsedSidebar",
        JSON.stringify(isSidebarCollapsed),
      );
    }
  }

  onMount(() => {
    sessionStorage.setItem(
      "collapsedSidebar",
      JSON.stringify(isSidebarCollapsed),
    );
  });
</script>

<div class="bg-muted/40 flex min-h-screen w-full flex-col" bind:clientWidth>
  <Sidebar bind:isCollapsed={isSidebarCollapsed} />

  <div
    class={clsx(
      "bg-muted/40 flex min-h-screen flex-col sm:pl-0 md:pl-44 lg:pl-44",
      !isSidebarCollapsed ? "md:pl-44 lg:pl-44" : "md:pl-8 lg:pl-8",
    )}
  >
    <div class="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
      <Header />
      <slot />
    </div>
  </div>
</div>
