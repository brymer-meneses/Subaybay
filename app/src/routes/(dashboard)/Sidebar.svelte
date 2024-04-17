<script lang="ts">
  import Inbox from "lucide-svelte/icons/inbox";
  import ListTodo from "lucide-svelte/icons/list-todo";
  import FileCog from "lucide-svelte/icons/file-cog";
  import LogOut from "lucide-svelte/icons/log-out";

  import Button from "$lib/components/ui/button/button.svelte";
  import * as Tooltip from "$lib/components/ui/tooltip";
  import UsersRound from "lucide-svelte/icons/users-round";

  import UpLogo from "$lib/assets/UP.png";
  import NavLink from "./NavLink.svelte";

  import * as Avatar from "$lib/components/ui/avatar";
</script>

<aside
  class="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex"
>
  <nav class="flex flex-col items-center gap-4 px-2 py-4">
    <Avatar.Root class="h-8 w-8">
      <Avatar.Image src={UpLogo} alt="UP Image" />
      <Avatar.Fallback>CN</Avatar.Fallback>
    </Avatar.Root>

    <NavLink icon={Inbox} name="Inbox" href="inbox" />
    <NavLink icon={ListTodo} name="Requests" href="requests" />
    <NavLink
      icon={FileCog}
      name="Requests Configuration"
      href="configuration"
    />
    <NavLink icon={UsersRound} name="Admin" href="admin" />
  </nav>

  <nav class="mt-auto flex flex-col items-center gap-4 px-2 py-4">
    <Tooltip.Root>
      <Tooltip.Trigger>
        <form method="post" action="/auth/logout">
          <Button
            type="submit"
            variant="link"
            class="rounded-lg text-muted-foreground"
          >
            <LogOut class="h-5 w-5" />
          </Button>
        </form>
      </Tooltip.Trigger>
      <Tooltip.Content side="right">Logout</Tooltip.Content>
    </Tooltip.Root>
  </nav>
</aside>
