<script lang="ts">
  import Inbox from "lucide-svelte/icons/inbox";
  import ListTodo from "lucide-svelte/icons/list-todo";
  import FileCog from "lucide-svelte/icons/file-cog";

  import ChevronLeft from "lucide-svelte/icons/chevron-left";
  import ChevronRight from "lucide-svelte/icons/chevron-right";

  import LogOut from "lucide-svelte/icons/log-out";

  import Button from "$lib/components/ui/button/button.svelte";
  import { Separator } from "$lib/components/ui/separator";
  import * as Tooltip from "$lib/components/ui/tooltip";
  import * as Avatar from "$lib/components/ui/avatar";
  import UsersRound from "lucide-svelte/icons/users-round";

  import UpLogo from "$lib/assets/UP.png";
  import NavLink from "./NavLink.svelte";
  import clsx from "clsx";

  export let isCollapsed: boolean;

  import Notification from "./Notification.svelte";
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
    <div class="flex w-full flex-col gap-2">
      <NavLink icon={Inbox} name="Inbox" href="inbox" {isCollapsed}></NavLink>
      <NavLink icon={ListTodo} name="Requests" href="requests" {isCollapsed} />
      <NavLink
        icon={FileCog}
        name="Configuration"
        href="configuration"
        {isCollapsed}
      />
      <NavLink icon={UsersRound} name="Admin" href="admin" {isCollapsed} />
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

  <nav class="mt-auto flex flex-col items-start gap-4 px-2 py-4">
    <Separator />
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
            <span>Sign Out</span>
          {/if}
        </div>
      </Tooltip.Trigger>
      <Tooltip.Content side="right">Logout</Tooltip.Content>
    </Tooltip.Root>
  </nav>
</aside>
