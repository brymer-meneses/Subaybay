<script lang="ts">
  import Inbox from "lucide-svelte/icons/inbox";
  import ListTodo from "lucide-svelte/icons/list-todo";
  import FileCog from "lucide-svelte/icons/file-cog";
  import LogOut from "lucide-svelte/icons/log-out";
  import UsersRound from "lucide-svelte/icons/users-round";
  import FilePlus from "lucide-svelte/icons/file-plus";
  import Bell from "lucide-svelte/icons/bell";

  // import Person from "svelte-radix/Person.svelte";
  // import Rocket from "svelte-radix/Rocket.svelte";

  import { onMount } from "svelte";
  import * as Command from "$lib/components/ui/command/index.js";
  import { goto } from "$app/navigation";

  export let open: boolean;

  import { page } from "$app/stores";

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

  async function signOut() {
    await fetch("/auth/logout", { method: "POST" });
    goto("/");
  }

  function handleOnSelect(page: string) {
    goto(`/${page}`);
    open = false;
  }
</script>

<Command.Dialog bind:open>
  <Command.Input placeholder="Type a command or search..." />
  <Command.List>
    <Command.Empty>No results found.</Command.Empty>

    <Command.Group heading="Go to">
      <Command.Item
        onSelect={() => handleOnSelect("notifications")}
        class="cursor-pointer"
      >
        <Bell class="mr-2 h-4 w-4" />
        <span>Notifications</span>
      </Command.Item>
      <Command.Item
        onSelect={() => handleOnSelect("inbox")}
        class="cursor-pointer"
      >
        <Inbox class="mr-2 h-4 w-4" />
        <span>Inbox</span>
      </Command.Item>
      <Command.Item
        onSelect={() => handleOnSelect("requests")}
        class="cursor-pointer"
      >
        <ListTodo class="mr-2 inline h-4 w-4" />
        <span>Requests</span>
      </Command.Item>
      <Command.Item
        onSelect={() => handleOnSelect("configuration")}
        class="cursor-pointer"
      >
        <FileCog class="mr-2 h-4 w-4" />
        <span>Configuration</span>
      </Command.Item>

      {#if $page.data.userInfo.isAdmin}
        <Command.Item
          onSelect={() => handleOnSelect("admin")}
          class="cursor-pointer"
        >
          <UsersRound class="mr-2 h-4 w-4" />
          <span>Admin</span>
        </Command.Item>
      {/if}
    </Command.Group>

    <Command.Separator />

    <Command.Group heading="Commands">
      <Command.Item class="cursor-pointer" onSelect={signOut}>
        <LogOut class="mr-2 h-4 w-4" />
        <span>Sign Out</span>
      </Command.Item>
      <Command.Item class="cursor-pointer">
        <FilePlus class="mr-2 h-4 w-4" />
        <span>Create Request</span>
      </Command.Item>
      <!--   <Command.Item> -->
      <!--     <EnvelopeClosed class="mr-2 h-4 w-4" /> -->
      <!--     <span>Mail</span> -->
      <!--     <Command.Shortcut>⌘B</Command.Shortcut> -->
      <!--   </Command.Item> -->
      <!--   <Command.Item> -->
      <!--     <Gear class="mr-2 h-4 w-4" /> -->
      <!--     <span>Settings</span> -->
      <!--     <Command.Shortcut>⌘S</Command.Shortcut> -->
      <!--   </Command.Item> -->
    </Command.Group>
  </Command.List>
</Command.Dialog>
