<script lang="ts">
  import Inbox from "lucide-svelte/icons/inbox";
  import ListTodo from "lucide-svelte/icons/list-todo";
  import FileCog from "lucide-svelte/icons/file-cog";
  import LogOut from "lucide-svelte/icons/log-out";

  import Button from "$lib/components/ui/button/button.svelte";
  import { Separator } from "$lib/components/ui/separator";
  import * as Tooltip from "$lib/components/ui/tooltip";
  import UsersRound from "lucide-svelte/icons/users-round";

  import UpLogo from "$lib/assets/UP.png";
  import NavLink from "./NavLink.svelte";

  import * as Avatar from "$lib/components/ui/avatar";
</script>

<aside
  class="bg-background fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r sm:flex"
>
  <nav class="flex flex-col items-center gap-4 px-2 py-4">
    <div class="flex items-center gap-2">
      <div>
        <Avatar.Root class="h-10 w-10">
          <Avatar.Image src={UpLogo} alt="UP Image" />
          <Avatar.Fallback>CN</Avatar.Fallback>
        </Avatar.Root>
      </div>
      <div class="text-2xl">UPB Subaybay</div>
    </div>
    <Separator />
    <div class="flex flex-col gap-2">
      <NavLink icon={Inbox} name="Inbox" href="inbox"></NavLink>
      <NavLink icon={ListTodo} name="Requests" href="requests" />
      <NavLink
        icon={FileCog}
        name="Requests Configuration"
        href="configuration"
      />
      <NavLink icon={UsersRound} name="Admin" href="admin" />
    </div>
  </nav>

  <nav class="mt-auto flex flex-col items-start gap-4 px-2 py-4">
    <Separator />
    <Tooltip.Root>
      <Tooltip.Trigger>
        <div
          class="text-muted-foreground hover:text-accent-foreground flex items-center"
        >
          <form method="post" action="/auth/logout">
            <Button
              type="submit"
              variant="link"
              class="text-muted-foreground rounded-lg"
            >
              <LogOut class="h-5 w-5" />
            </Button>
          </form>
          <span>Sign Out</span>
        </div>
      </Tooltip.Trigger>
      <Tooltip.Content side="right">Logout</Tooltip.Content>
    </Tooltip.Root>
  </nav>
</aside>
