<script lang="ts">
  import Sidebar from "./Sidebar.svelte";
  import Header from "./Header.svelte";
  import clsx from "clsx";
  import { onMount } from "svelte";
  import type { LayoutServerData } from "./$types";
  import queryString from "query-string";
  import { toast } from "svelte-sonner";
  import { notifications } from "$lib/notifications";

  import type { Message, Request, User } from "$lib/server/database";
  import NewMessageNotification from "$lib/components/notifications/NewMessageNotification.svelte";
    import NewStageNotification from "$lib/components/notifications/NewStageNotification.svelte";

  let isSidebarCollapsed = false;
  let clientWidth: number;

  $: {
    if (clientWidth < 765) {
      isSidebarCollapsed = true;
    } else if (typeof window !== "undefined") {
      isSidebarCollapsed = JSON.parse(
        sessionStorage.getItem("collapsedSidebar") ?? "false",
      );
    }
  }

  $: {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "collapsedSidebar",
        JSON.stringify(isSidebarCollapsed),
      );
    }
  }

  onMount(() => {
    sessionStorage.setItem(
      "collapsedSidebar",
      JSON.stringify(isSidebarCollapsed),
    );
  });

  export let data: LayoutServerData;
  let socket: WebSocket;

  $: userId = data.userInfo.id;
  $: sessionId = data.sessionId;

  onMount(() => {
    socket = new WebSocket(
      `ws://localhost:8080/notifications/ws?userId=${userId}`,
    );

    socket.onerror = (ev) => {
      toast.error("Failed to connect to the notifications server", {
        description: "Notifications will not work properly",
      });
    };

    socket.onclose = () => {
      toast.error("The notifications server closed unexpectedly", {
        description: "Notifications will not work properly",
      });
    };

    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          type: "authenticate",
          content: {
            sessionId,
          },
        }),
      );
    };

    socket.onmessage = wsReceiveHandler;
  });

  async function wsReceiveHandler(event: any) {
    try {
      let data = await event.data.text();
      let payload = JSON.parse(data);

      switch (payload.type) {
        case "unseenNotificationsCount": {
          $notifications = payload.content;
          break;
        }

        case "newStage": {
          let { from, request, requestType } = payload.content;

          toast.custom(NewStageNotification, {
            componentProps: {
              from,
              request,
              requestType,
              type: "pass",
            },
            classes: {
              toast: "rounded-lg",
            },
          });
          break;
        }

        case "newReassignedStage": {
          let { from, request, requestType } = payload.content;

          toast.custom(NewStageNotification, {
            componentProps: {
              from,
              request,
              requestType,
              type: "reassign",
            },
            classes: {
              toast: "rounded-lg",
            },
          });
          break;
        }

        case "newRolledBackStage": {
          console.log(payload);
          break;
        }

        case "newMessage": {
          interface NewMessage {
            request: Request;
            message: Message;
            from: User;
          }

          // TODO: create a custom component for new message notification
          let { request, message, from }: NewMessage = payload.content;
          toast.custom(NewMessageNotification, {
            componentProps: {
              from,
            },
            duration: 10000000, // TODO: remove this
            classes: {
              toast: "rounded-lg",
            },
          });
        }

        // TODO: implement this
        case "newInboxItem": {
        }
      }
    } catch (err: any) {
      console.error("Invalid data: ", err.message);
    }
  }
</script>

<div class="flex min-h-screen w-full flex-col bg-muted/40" bind:clientWidth>
  <Sidebar bind:isCollapsed={isSidebarCollapsed} />

  <div
    class={clsx(
      "flex min-h-screen flex-col bg-muted/40 sm:pl-0 md:pl-44 lg:pl-44",
      !isSidebarCollapsed ? "md:pl-44 lg:pl-44" : "md:pl-8 lg:pl-8",
    )}
  >
    <div class="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
      <Header />
      <slot />
    </div>
  </div>
</div>
