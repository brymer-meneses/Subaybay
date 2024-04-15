<script lang="ts">
  import { onMount } from "svelte";
  import * as Command from "$lib/components/ui/command/index.js";
  let open = false;

  onMount(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        open = !open;
      }
    }

    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  });
</script>

<p class="text-sm text-muted-foreground">
  Press
  <kbd
    class="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"
  >
    <span class="text-xs">⌘</span>J
  </kbd>
</p>
<Command.Dialog bind:open>
  <Command.Input placeholder="Type a command or search..." />
  <Command.List>
    <Command.Empty>No results found.</Command.Empty>
    <Command.Group heading="General">
      <Command.Item>
        <span>Inbox</span>
      </Command.Item>
      <Command.Item>
        <span>Request Tracker</span>
      </Command.Item>
      <Command.Item>
        <span>Logout</span>
      </Command.Item>
    </Command.Group>
    <Command.Separator />
    <Command.Group heading="Only admins should see the following">
      <Command.Item>
        <span>Registered accounts and Roles</span>
        <Command.Shortcut>⌘P</Command.Shortcut>
      </Command.Item>
      <Command.Item>
        <span>Request Configuration</span>
        <Command.Shortcut>⌘B</Command.Shortcut>
      </Command.Item>
      <Command.Item>
        <span>Settings</span>
        <Command.Shortcut>⌘S</Command.Shortcut>
      </Command.Item>
    </Command.Group>
  </Command.List>
</Command.Dialog>

<style>
  span {
    margin-left: 1rem;
  }
</style>
