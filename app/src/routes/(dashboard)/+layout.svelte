<script lang="ts">
  import Sidebar from "./Sidebar.svelte";
  import Header from "./Header.svelte";
  import clsx from "clsx";

  let isSidebarCollapsed = false;
</script>

<div class="flex min-h-screen w-full flex-col bg-muted/40">
  <Sidebar bind:isCollapsed={isSidebarCollapsed} />

  <div
    class={clsx(
      "flex min-h-screen flex-col bg-muted/40 sm:pl-0 md:pl-44 lg:pl-44",
      !isSidebarCollapsed ? "md:pl-44 lg:pl-44" : "md:pl-8 lg:pl-8",
    )}
  >
    <div class="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
      <Header />
      <slot />
    </div>
  </div>
</div>
