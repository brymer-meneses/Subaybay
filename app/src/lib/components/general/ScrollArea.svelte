<script lang="ts">
  import { ScrollArea } from "bits-ui";
</script>

<ScrollArea.Root class="relative h-full w-full px-4">
  <ScrollArea.Viewport class="h-full w-full">
    <ScrollArea.Content>
      <slot />
    </ScrollArea.Content>
  </ScrollArea.Viewport>

  <ScrollArea.Scrollbar
    orientation="vertical"
    class="flex h-full w-2.5 touch-none select-none rounded-full border-l border-l-transparent p-px transition-all hover:w-3 hover:bg-dark-10"
  >
    <ScrollArea.Thumb
      class="relative flex-1 rounded-full bg-muted-foreground opacity-40 bg-pale-red-300 transition-opacity hover:opacity-100"
    />
  </ScrollArea.Scrollbar>
  <ScrollArea.Corner />
</ScrollArea.Root>
