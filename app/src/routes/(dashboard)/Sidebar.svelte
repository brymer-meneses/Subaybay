<script lang="ts">
  import Inbox from "lucide-svelte/icons/inbox";
  import ListTodo from "lucide-svelte/icons/list-todo";
  import FileCog from "lucide-svelte/icons/file-cog";
  import UsersRound from "lucide-svelte/icons/users-round";
  import Book from "lucide-svelte/icons/book";
  import Bell from "lucide-svelte/icons/bell";

  import ChevronLeft from "lucide-svelte/icons/chevron-left";
  import ChevronRight from "lucide-svelte/icons/chevron-right";

  import LogOut from "lucide-svelte/icons/log-out";

  import Button from "$lib/components/ui/button/button.svelte";
  import { Separator } from "$lib/components/ui/separator";
  import * as Tooltip from "$lib/components/ui/tooltip";
  import * as Avatar from "$lib/components/ui/avatar";

  import UpLogo from "$lib/assets/UP.png";
  import NavLink from "./NavLink.svelte";
  import clsx from "clsx";

  import { page } from "$app/stores";

  import Notifiable from "./Notifiable.svelte";
  import { notifications, type Notifications } from "$lib/notifications";

  export let isCollapsed: boolean;

  $: totalCount = getTotalCount($notifications);

  function getTotalCount(content: Notifications) {
    let totalCount = 0;
    for (const [key, count] of content.inbox.pending) {
      totalCount += count;
    }
    for (const [key, count] of content.inbox.active) {
      totalCount += count;
    }
    return { inbox: totalCount };
  }
</script>

<aside
  class={clsx(
    "bg-background fixed inset-y-0 left-0 hidden flex-col border-r sm:flex",
    isCollapsed ? "w-[81px] items-center" : "w-[224px] items-start",
  )}
>
  <nav
    class={clsx(
      "flex flex-col items-center gap-4 px-4 py-4",
      isCollapsed ? "" : "w-[13.95rem]",
    )}
  >
    <div class="flex items-center gap-2">
      <div>
        <Avatar.Root class="h-8 w-8">
          <Avatar.Image src={UpLogo} alt="UP Image" />
          <Avatar.Fallback>CN</Avatar.Fallback>
        </Avatar.Root>
      </div>

      {#if !isCollapsed}
        <div class="text-2xl">
          <p>Subaybay</p>
        </div>
      {/if}
    </div>
    <Separator />
    <div class="flex w-full flex-col">
      <Notifiable active={true}>
        <NavLink
          icon={Bell}
          name="Notifications"
          href="/notifications"
          {isCollapsed}
        />
      </Notifiable>
      <NavLink icon={Inbox} name="Inbox" href="/inbox" {isCollapsed} />
      <NavLink icon={ListTodo} name="Requests" href="/requests" {isCollapsed} />
      <NavLink
        icon={FileCog}
        name="Configuration"
        href="/configuration"
        {isCollapsed}
      />
      {#if $page.data.userInfo.isAdmin}
        <NavLink icon={UsersRound} name="Admin" href="/admin" {isCollapsed} />
      {/if}
    </div>

    <Button
      variant="secondary"
      class="absolute bottom-1/2 right-[-10px] hidden h-8 w-8 drop-shadow-sm md:flex"
      on:click={() => (isCollapsed = !isCollapsed)}
    >
      {#if isCollapsed}
        <ChevronRight class="min-h-8 min-w-8 stroke-1" />
      {:else}
        <ChevronLeft class="min-h-8 min-w-8 stroke-1" />
      {/if}
    </Button>
  </nav>

  <nav class="mt-auto flex w-full flex-col items-start p-2">
    <Tooltip.Root>
      <Tooltip.Trigger>
        <div
          class="text-muted-foreground hover:text-accent-foreground flex items-center"
        >
          <NavLink
            icon={Book}
            name="Manual"
            href="/docs"
            {isCollapsed}
            target="_self"
          />
        </div>
      </Tooltip.Trigger>
      <Tooltip.Content side="right">Manual</Tooltip.Content>
    </Tooltip.Root>
    <Separator class="w-full" />
    <Tooltip.Root>
      <Tooltip.Trigger>
        <div
          class="text-muted-foreground hover:text-accent-foreground flex items-center"
        >
          <form method="post" action="/auth/logout">
            <Button
              type="submit"
              variant="link"
              class="text-muted-foreground gap-2 rounded-lg hover:no-underline"
            >
              <LogOut class="h-5 w-5" /><span class="text-sm font-normal"
                >{!isCollapsed ? "Sign Out" : ""}</span
              >
            </Button>
          </form>
        </div>
      </Tooltip.Trigger>
      <Tooltip.Content side="right">Logout</Tooltip.Content>
    </Tooltip.Root>
  </nav>
</aside>
