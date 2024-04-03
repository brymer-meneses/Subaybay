<script lang="ts">
  import Sidebar from "$lib/components/dashboard/Sidebar/Sidebar.svelte";
  import * as Resizable from "$lib/components/ui/resizable/index.js";
</script>

<Resizable.PaneGroup
  direction="horizontal"
  class="h-screen w-screen flex bg-background"
  autoSaveId="sidebar"
>
  <Resizable.Pane defaultSize={10} minSize={5} maxSize={20}>
    <Sidebar />
  </Resizable.Pane>

  <Resizable.Handle />

  <Resizable.Pane defaultSize={90}>
    <div class="h-screen w-full bg-pale-red-100">
      <slot />
    </div>
  </Resizable.Pane>
</Resizable.PaneGroup>
