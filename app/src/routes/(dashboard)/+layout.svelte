<script lang="ts">
  import Sidebar from "./Sidebar.svelte";
  import Header from "./Header.svelte";
  import clsx from "clsx";
  import { onMount, setContext } from "svelte";
  import type { LayoutServerData } from "./$types";
  import queryString from "query-string";
  import { toast } from "svelte-sonner";
  import { notifications } from "$lib/notifications";

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
    const params = { userId, sessionId };

    socket = new WebSocket(
      `ws://localhost:8080/notifications/ws?${queryString.stringify(params)}`,
    );
    socket.onerror = (ev) => {
      toast.error("Failed to connect to the notifications server", {
        description: "Notifications will not work properly",
      });
    };
    socket.onmessage = wsReceiveHandler;
  });

  async function wsReceiveHandler(event: any) {
    try {
      let data = await event.data.text();
      let message = JSON.parse(data);

      switch (message.type) {
        case "unseenNotificationsCount": {
          $notifications = message.content;
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
