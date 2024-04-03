<script lang="ts">
  import Sidebar from "$lib/components/general/Sidebar/Sidebar.svelte";
</script>

<main class="h-screen w-screen flex bg-background">
  <Sidebar />
  <slot />
</main>
