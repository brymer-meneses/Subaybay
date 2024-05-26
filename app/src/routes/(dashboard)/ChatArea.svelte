<script lang="ts">
  import { onMount, tick } from "svelte";
  import { page } from "$app/stores";
  import { toast } from "svelte-sonner";
  import * as Card from "$lib/components/ui/card/index.js";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";

  import ChatMessage from "./ChatMessage.svelte";
  import SendHorizontal from "lucide-svelte/icons/send-horizontal";
  import { Input } from "$lib/components/ui/input";
  import { Button } from "$lib/components/ui/button";

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
    userId: string;
  };

  type Event = {
    content: string;
    roomId: string;
    userId: string;
  };

  type ClientMessage = {
    type: "message" | "event";
    content: Reply | Event;
  };

  export let requestId: string;
  export let height: string = "h-48";

  $: userId = $page.data.userInfo.id;
  $: sessionId = $page.data.sessionId;

  let messages: Array<ServerMessage> = [];
  let socket: WebSocket;
  let messageContent: string;

  let messageContainer: HTMLDivElement;

  onMount(async () => {
    const params = {
      sessionId,
      userId,
      requestId,
    };

    socket = new WebSocket(
      `ws://localhost:8080/chat/ws?${queryString.stringify(params)}`,
    );
    socket.onerror = (ev) => {
      toast.error("Failed to connect to the chat server", {
        description: "Sending and receiving messages will not work",
      });
      // socket = null;
    };
    socket.onmessage = receiveMessageHandler;
  });

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
    const messagePayload: ClientMessage = {
      type: "message",
      content: {
        content: messageContent,
        userId,
      },
    };

    socket.send(JSON.stringify(messagePayload));
    messageContent = "";
  }
</script>

<Card.Root>
  <Card.Content class="flex w-full flex-col gap-5 p-3">
    <ScrollArea>
      <div bind:this={messageContainer}>
        <div class={height + " flex w-[96%] flex-col gap-2"}>
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
    </ScrollArea>

    <div class="flex w-full items-center space-x-2">
      <Input
        class="border-b-1 bg-accent w-full focus:ring-0 focus:ring-offset-0"
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
