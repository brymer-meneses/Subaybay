<script lang="ts">
  import Sidebar from "$lib/components/general/Sidebar/Sidebar.svelte";

  import * as Resizable from "$lib/components/ui/resizable";
</script>

<Resizable.PaneGroup
  direction="horizontal"
  class="h-screen w-screen flex bg-background"
  autoSaveId="paneGroup1"
>
  <Resizable.Pane defaultSize={10} minSize={5} maxSize={20}>
    <Sidebar />
  </Resizable.Pane>

  <Resizable.Handle />

  <Resizable.Pane defaultSize={25} minSize={20}>
    <section
      class="flex flex-col items-center gap-8 p-5 bg-pale-red-100 h-screen"
    ></section>
  </Resizable.Pane>

  <Resizable.Handle />

  <Resizable.Pane defaultSize={30} minSize={40}>
    <section
      class="p-5 bg-pale-red-200 flex flex-col gap-10 h-screen"
    ></section>
  </Resizable.Pane>
</Resizable.PaneGroup>
