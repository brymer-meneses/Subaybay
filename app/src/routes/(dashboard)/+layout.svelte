<script lang="ts">
  import Sidebar from "./Sidebar.svelte";
  import Header from "./Header.svelte";
  import clsx from "clsx";
<<<<<<< HEAD
  import { onMount } from "svelte";

  let isSidebarCollapsed = true;
  let clientWidth: number;

  $: {
    if (clientWidth < 765) {
      isSidebarCollapsed = true;
    } else if (typeof window !== "undefined") {
      isSidebarCollapsed = JSON.parse(
        sessionStorage.getItem("collapsedSidebar") ?? "true",
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
</script>

<div class="bg-muted/40 flex min-h-screen w-full flex-col" bind:clientWidth>
  <Sidebar bind:isCollapsed={isSidebarCollapsed} />
=======
  import type { LayoutServerData } from "./$types";
  import { onMount } from "svelte";
  import queryString from "query-string";
  import { toast } from "svelte-sonner";
  import { browser } from "$app/environment";

  let isSidebarCollapsed = false;

  export let data: LayoutServerData;
  let socket: WebSocket;

  $: userId = data.userInfo.id;
  $: sessionId = data.sessionId;

  let notifications = { messages: 0, requests: 0 };

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
      console.log(message);

      switch (message.type) {
        case "unseenNotificationsCount": {
          notifications = message.content;
          console.log(message.content);
        }
      }
    } catch (err: any) {
      console.error("Invalid data: ", err.message);
    }
  }
</script>

<div class="flex min-h-screen w-full flex-col bg-muted/40">
  <Sidebar bind:isCollapsed={isSidebarCollapsed} {notifications} />
>>>>>>> b1188cc (draft for notifications (still not working)

  <div
    class={clsx(
      "bg-muted/40 flex min-h-screen flex-col sm:pl-0 md:pl-44 lg:pl-44",
      !isSidebarCollapsed ? "md:pl-44 lg:pl-44" : "md:pl-8 lg:pl-8",
    )}
  >
    <div class="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
      <Header />
      <slot />
    </div>
  </div>
</div>
