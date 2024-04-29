<script lang="ts">
  import Bell from "lucide-svelte/icons/bell";

  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import Button from "$lib/components/ui/button/button.svelte";

  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import queryString from "query-string";
  import { toast } from "svelte-sonner";

  $: userId = $page.data.userInfo.id;
  $: sessionId = $page.data.sessionId;

  let socket: WebSocket;
  onMount(() => {
    const params = {
      sessionId: sessionId,
      userId: userId,
    };

    socket = new WebSocket(
      `ws://localhost:8080/notifications/ws?${queryString.stringify(params)}`,
    );

    socket.onerror = (ev) => {
      toast.error("Failed to connect to the notifications server", {
        description: "Notifications will not be received",
      });
    };
  });
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    <Button variant="ghost" class="h-9 w-9 p-0">
      <Bell class="stroke-muted-foreground" />
    </Button>
  </DropdownMenu.Trigger>

  <DropdownMenu.Content side="right" sideOffset={20}>
    <DropdownMenu.Group>
      <DropdownMenu.Label>Notifications</DropdownMenu.Label>
      <DropdownMenu.Separator />
      <DropdownMenu.Item>Profile</DropdownMenu.Item>
      <DropdownMenu.Item>Billing</DropdownMenu.Item>
      <DropdownMenu.Item>Team</DropdownMenu.Item>
      <DropdownMenu.Item>Subscription</DropdownMenu.Item>
      <DropdownMenu.Item>Profile</DropdownMenu.Item>
      <DropdownMenu.Item>Billing</DropdownMenu.Item>
      <DropdownMenu.Item>Team</DropdownMenu.Item>
      <DropdownMenu.Item>Subscription</DropdownMenu.Item>
    </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root>
