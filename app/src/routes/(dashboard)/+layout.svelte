<script lang="ts">
  import SearchPopUp from "$lib/components/dashboard/Search/SearchPopUp.svelte";
  import Sidebar from "$lib/components/dashboard/Sidebar/Sidebar.svelte";
  import * as Resizable from "$lib/components/ui/resizable/index.js";
</script>

<Resizable.PaneGroup
  direction="horizontal"
  class="h-screen w-screen flex bg-background"
  autoSaveId="sidebar"
>
  <Sidebar />

  <Resizable.Handle />

  <Resizable.Pane defaultSize={90}>
    <div class="h-screen w-full bg-pale-red-100">
      <slot />
    </div>
  </Resizable.Pane>
</Resizable.PaneGroup>
<SearchPopUp />