<script lang="ts">
  import Bell from "lucide-svelte/icons/bell";

  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import Button from "$lib/components/ui/button/button.svelte";
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
      <!-- <DropdownMenu.Item>Profile</DropdownMenu.Item> -->
      <!-- <DropdownMenu.Item>Billing</DropdownMenu.Item> -->
      <!-- <DropdownMenu.Item>Team</DropdownMenu.Item> -->
      <!-- <DropdownMenu.Item>Subscription</DropdownMenu.Item> -->
      <!-- <DropdownMenu.Item>Profile</DropdownMenu.Item> -->
      <!-- <DropdownMenu.Item>Billing</DropdownMenu.Item> -->
      <!-- <DropdownMenu.Item>Team</DropdownMenu.Item> -->
      <!-- <DropdownMenu.Item>Subscription</DropdownMenu.Item> -->
    </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root>
