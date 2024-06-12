<script lang="ts">
  import * as Tabs from "$lib/components/ui/tabs";
  import * as Card from "$lib/components/ui/card";
  import { ScrollArea } from "$lib/components/ui/scroll-area";

  import type { PageServerData } from "./$types";
  import { invalidateAll, goto } from "$app/navigation";
  import { applyAction, deserialize } from "$app/forms";

  import MessageItem from "./MessageItem.svelte";
  import RequestItem from "./RequestItem.svelte";
  import type { ActionResult } from "@sveltejs/kit";

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
        <Card.Root class="h-[80vh] w-full">
          <Card.Content class="h-full p-4">
            <ScrollArea class="h-full">
              <div class="flex w-[99%] flex-col gap-1">
                {#if data.inboxNotificationsData.length === 0}
                  You have no request notifications.
                {:else}
                  {#each data.inboxNotificationsData as requestData}
                    <form method="POST" action="?/set_seen">
                      <input
                        hidden
                        value={requestData._id}
                        name="notification_id"
                      />
                      <RequestItem isSelected={false} data={requestData} />
                    </form>
                  {/each}
                {/if}
              </div>
            </ScrollArea>
          </Card.Content>
        </Card.Root>
      </Tabs.Content>
      <Tabs.Content value="messages">
        <Card.Root class="h-[80vh] w-full">
          <Card.Content class="h-full p-4">
            <ScrollArea class="h-full">
              <div
                class="flex w-[99%] flex-col items-center justify-center gap-1"
              >
                {#if data.messageNotificationData.length === 0}
                  You have no message notifications.
                {:else}
                  {#each data.messageNotificationData as messageData}
                    <form method="POST" action="?/set_seen">
                      <input
                        hidden
                        value={messageData._id}
                        name="notification_id"
                      />
                      <MessageItem isSelected={false} data={messageData} />
                    </form>
                  {/each}
                {/if}
              </div>
            </ScrollArea>
          </Card.Content>
        </Card.Root>
      </Tabs.Content>
    </Tabs.Root>
  </div>
</main>
