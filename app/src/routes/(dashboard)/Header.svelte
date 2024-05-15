<script lang="ts">
  import Inbox from "lucide-svelte/icons/inbox";
  import ListTodo from "lucide-svelte/icons/list-todo";
  import FileCog from "lucide-svelte/icons/file-cog";
  import UsersRound from "lucide-svelte/icons/users-round";

  import PanelLeft from "lucide-svelte/icons/panel-left";
  import Search from "lucide-svelte/icons/search";

  import * as Tooltip from "$lib/components/ui/tooltip";

  import { Button } from "$lib/components/ui/button/index.js";
  import * as Sheet from "$lib/components/ui/sheet/index.js";
  import NavLink from "./NavLink.svelte";
  import CommandBox from "./CommandBox.svelte";

  import { page } from "$app/stores";

  $: title = $page.route.id?.toString().split("/").at(-1);
  let open = false;
</script>

<header
  class="bg-background sticky top-0 z-30 flex h-14 items-center gap-4 border-b px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6"
>
  <Sheet.Root>
    <Sheet.Trigger asChild let:builder>
      <Button
        builders={[builder]}
        size="icon"
        variant="outline"
        class="sm:hidden"
      >
        <PanelLeft class="h-5 w-5" />
        <span class="sr-only">Toggle Menu</span>
      </Button>
    </Sheet.Trigger>
    <Sheet.Content side="left" class="sm:max-w-xs">
      <nav class="grid gap-6 text-lg font-medium">
        <p>UPB Subaybay</p>
        <NavLink icon={Inbox} name="Inbox" href="/inbox" isCollapsed={false} />
        <NavLink
          icon={ListTodo}
          name="Requests"
          href="/requests"
          isCollapsed={false}
        />
        <NavLink
          icon={FileCog}
          name="Configuration"
          href="/configuration"
          isCollapsed={false}
        />
        {#if $page.data.userInfo.isAdmin}
          <NavLink
            icon={UsersRound}
            name="Admin"
            href="/admin"
            isCollapsed={false}
          />
        {/if}
      </nav>
    </Sheet.Content>
  </Sheet.Root>

  <div class="relative ml-auto flex-1 items-center md:grow-0">
    <Button
      variant="ghost"
      class="border-border bg-background flex w-full cursor-pointer flex-row items-center justify-between rounded-lg border md:w-[200px] lg:w-[320px]"
      on:click={() => {
        open = !open;
      }}
    >
      <div class="flex flex-row gap-4">
        <Search class="text-muted-foreground h-4 w-4" />
        <p class="text-muted-foreground text-xs">Click here to search ...</p>
      </div>
      <kbd
        class="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 drop-shadow-sm"
      >
        <span class="text-xs">⌘</span>J
      </kbd>
    </Button>
  </div>

  <Tooltip.Root>
    <Tooltip.Trigger>
      <img
        src={$page.data.userInfo.profileUrl}
        width={36}
        height={36}
        alt="Avatar"
        class="overflow-hidden rounded-full"
      />
    </Tooltip.Trigger>
    <Tooltip.Content>
      <p>{$page.data.userInfo.name}</p>
      <p>{$page.data.userInfo.email}</p>
    </Tooltip.Content>
  </Tooltip.Root>
</header>
<CommandBox bind:open />
