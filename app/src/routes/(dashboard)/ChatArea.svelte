<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { beforeUpdate, tick } from "svelte";
  import { toast } from "svelte-sonner";
  import * as Card from "$lib/components/ui/card/index.js";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";

  import ChatMessage from "./ChatMessage.svelte";
  import SendHorizontal from "lucide-svelte/icons/send-horizontal";
  import { Input } from "$lib/components/ui/input";
  import { Button } from "$lib/components/ui/button";

  import { browser } from "$app/environment";

  import queryString from "query-string";

  type ServerMessage = {
    type: "previousMessages" | "reply";
    dateTime: number;
    content: string;
    userId: string;
    profileUrl: string;
  };

  type Reply = {
    content: string;
    requestId: string;
  };

  type Event = {
    content: string;
    userId: string;
  };

  type ClientMessage = {
    type: "message" | "event";
    content: Reply | Event;
  };

  export let requestId: string;

  $: userId = $page.data.userInfo.id;
  $: sessionId = $page.data.sessionId;

  $: if (requestId && browser) {
    initializeWebsocket();
  }

  let messages: Array<ServerMessage> = [];
  let socket: WebSocket | null = null;
  let messageContent: string;

  let messageContainer: HTMLDivElement;
  let isExpectedWebSocketClose = false;

  // NOTE:
  // We need to put this in a function since
  // the svelte compiler will cause a loop here since
  // we're setting both `isExpectedWebSocketClose = true`
  // and `false` at the same time.
  // Which causes a loop since they would listen to each other
  function initializeWebsocket() {
    if (socket !== null) {
      isExpectedWebSocketClose = true;
      socket.close();
    }

    const params = {
      userId,
      requestId,
    };

    const root = `${$page.url.hostname}:${$page.url.port}`;

    socket = new WebSocket(
      `ws://${root}/socket/chat/ws?${queryString.stringify(params)}`,
    );

    socket.onopen = () => {
      // @ts-ignore
      socket.send(
        JSON.stringify({
          type: "authenticate",
          content: {
            sessionId,
          },
        }),
      );
      isExpectedWebSocketClose = false;
    };

    socket.onclose = () => {
      if (!isExpectedWebSocketClose) {
        toast.error("The chat server unexpectedly closed", {
          description: "Sending and receiving messages will not work",
        });
      }
    };

    socket.onerror = () => {
      if (!isExpectedWebSocketClose) {
        toast.error("Failed to connect to the chat server", {
          description: "Sending and receiving messages will not work",
        });
      }
    };

    socket.onmessage = receiveMessageHandler;
  }

  async function scrollToBottom(node: HTMLDivElement) {
    node.scroll({ top: node.scrollHeight, behavior: "smooth" });
  }

  async function receiveMessageHandler(event: any) {
    try {
      let data = await event.data.text();
      let message = JSON.parse(data);

      if (message.type === "previousMessages") {
        messages = message.content;
      } else {
        messages.push(message.content);
        messages = messages;
      }
    } catch (err: any) {
      console.error("Invalid data: ", err.message);
    }

    await tick();
    scrollToBottom(messageContainer);
  }

  async function sendMessageHandler() {
    if (messageContent.length === 0) return;

    const messagePayload: ClientMessage = {
      type: "message",
      content: {
        content: messageContent,
        userId,
      },
    };

    if (socket !== null) {
      socket.send(JSON.stringify(messagePayload));
      messageContent = "";
    }
  }

  onMount(() => {
    // async function handleKeydown(e: KeyboardEvent) {
    //   if (e.key === "Enter") {
    //     await sendMessageHandler();
    //   }
    // }
    // document.addEventListener("keydown", handleKeydown);
    // return () => {
    //   document.removeEventListener("keydown", handleKeydown);
    // };
  });
</script>

<Card.Root class="flex h-full flex-col">
  <Card.Content class="flex h-full w-full grow flex-col gap-5 p-3">
    <div bind:this={messageContainer} class="h-[50vh] overflow-auto xl:h-full">
      <div class="flex h-full w-[96%] flex-col gap-2">
        {#each messages as message, _}
          <ChatMessage
            message={message.content}
            byYou={message.userId == userId ? true : false}
            dateTime={message.dateTime}
            profileUrl={message.profileUrl}
          />
        {/each}
      </div>
    </div>

    <div class="flex w-full items-center space-x-2">
      <Input
        class="border-b-1 w-full bg-accent focus:ring-0 focus:ring-offset-0"
        placeholder="Send a message ..."
        bind:value={messageContent}
      />

      <Button
        on:click={sendMessageHandler}
        variant="outline"
        disabled={socket === null}
      >
        <SendHorizontal />
      </Button>
    </div>
  </Card.Content>
</Card.Root>
