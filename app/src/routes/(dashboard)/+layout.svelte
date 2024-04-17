<script lang="ts">
  import Sidebar from "./Sidebar.svelte";
  import Header from "./Header.svelte";
</script>

<div class="flex min-h-screen w-full flex-col bg-muted/40">
  <Sidebar />

  <div class="flex min-h-screen w-full flex-col bg-muted/40">
    <div class="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
      <Header />
      <slot />
    </div>
  </div>
</div>
