<script lang="ts">
  import Inbox from "lucide-svelte/icons/inbox";
  import ListTodo from "lucide-svelte/icons/list-todo";
  import FileCog from "lucide-svelte/icons/file-cog";
  import UsersRound from "lucide-svelte/icons/users-round";

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

  export let isCollapsed: boolean;
  export let notifications: { messages: number; requests: number };
</script>

<aside
  class={clsx(
    "fixed inset-y-0 left-0  hidden flex-col border-r bg-background transition-all sm:flex",
    isCollapsed ? "w-[80px] items-center" : "w-[200px] items-start",
  )}
>
  <nav class="flex flex-col items-center gap-4 px-4 py-4">
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
      <NavLink
        icon={Inbox}
        name="Inbox"
        href="/inbox"
        {isCollapsed}
        notifications={notifications.messages}
      ></NavLink>
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
    <Separator class="w-full" />
    <Tooltip.Root>
      <Tooltip.Trigger>
        <div
          class="flex items-center text-muted-foreground hover:text-accent-foreground"
        >
          <form method="post" action="/auth/logout">
            <Button
              type="submit"
              variant="link"
              class="rounded-lg text-muted-foreground"
            >
              <LogOut class="h-5 w-5" />
            </Button>
          </form>
          {#if !isCollapsed}
            <span class="text-sm">Sign Out</span>
          {/if}
        </div>
      </Tooltip.Trigger>
      <Tooltip.Content side="right">Logout</Tooltip.Content>
    </Tooltip.Root>
  </nav>
</aside>
