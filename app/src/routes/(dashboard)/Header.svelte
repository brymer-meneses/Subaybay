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
  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
  import NavLink from "./NavLink.svelte";
  import CommandBox from "./CommandBox.svelte";

  import { page } from "$app/stores";

  console.log($page.data.headerData);

  let requestId = $page.route.id?.includes("requests")
    ? !$page.route.id?.endsWith("requests")
      ? $page.url.pathname.split("/").at(-1)
      : undefined
    : undefined;
  let open = false;
</script>

<header
  class="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6"
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

  <Breadcrumb.Root class="hidden md:flex">
    <Breadcrumb.List>
      {#each $page.data.headerData as data, index}
        <Breadcrumb.Item>
          <Breadcrumb.Link href={data.href}>{data.content}</Breadcrumb.Link>
        </Breadcrumb.Item>
        {#if index !== $page.data.headerData.length - 1}
          <Breadcrumb.Separator />
        {/if}
      {/each}
    </Breadcrumb.List>
  </Breadcrumb.Root>

  <div class="relative ml-auto flex-1 items-center md:grow-0">
    <Button
      variant="ghost"
      class="flex w-full cursor-pointer flex-row items-center justify-between rounded-lg border border-border bg-background md:w-[200px] lg:w-[320px]"
      on:click={() => {
        open = !open;
      }}
    >
      <div class="flex flex-row gap-4">
        <Search class="h-4 w-4 text-muted-foreground" />
        <p class="text-xs text-muted-foreground">Click here to search ...</p>
      </div>
      <kbd
        class="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 drop-shadow-sm"
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
