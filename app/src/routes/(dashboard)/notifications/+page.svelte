<script lang="ts">
  import * as Tabs from "$lib/components/ui/tabs";
  import type { PageServerData } from "./$types";

  import MessagesList from "./MessagesList.svelte";
  import RequestsList from "./RequestsList.svelte";

  export let data: PageServerData;
</script>

<main
  class="flex flex-1 flex-col items-center justify-center gap-4 p-4 sm:px-6 sm:py-0 md:gap-8"
>
  <div class="w-[60%]">
    <Tabs.Root value="requests">
      <Tabs.List>
        <Tabs.Trigger value="requests">Requests</Tabs.Trigger>
        <Tabs.Trigger value="messages">Messages</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="requests">
        <RequestsList data={data.inboxNotificationsData} />
      </Tabs.Content>
      <Tabs.Content value="messages">
        <MessagesList data={data.messageNotificationData} />
      </Tabs.Content>
    </Tabs.Root>
  </div>
</main>
