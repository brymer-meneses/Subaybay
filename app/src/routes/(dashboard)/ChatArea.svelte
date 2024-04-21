<script lang="ts">
  import { onMount, tick } from "svelte";
  import { page } from "$app/stores";
  import { toast } from "svelte-sonner";

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
    chatId: string;
    userId: string;
  };

  type Event = {
    content: string;
    chatId: string;
    userId: string;
  };

  type ClientMessage = {
    type: "message" | "event";
    content: Reply | Event;
  };

  export let chatId: string;

  $: userId = $page.data.userInfo.id;
  $: sessionId = $page.data.sessionId;

  let messages: Array<ServerMessage> = [];
  let socket: WebSocket;
  let messageContent: string;

  let messageContainer: HTMLDivElement;

  onMount(async () => {
    // TODO: should encode roomId somehow
    // probably in this format: requestId-step
    const params = {
      session_id: sessionId,
      user_id: userId,
      chat_id: chatId,
    };

    socket = new WebSocket(
      `ws://localhost:8080/chat/ws?${queryString.stringify(params)}`,
    );
    socket.onerror = (ev) => {
      toast.error("Failed to connect to the chat server", {
        description: "Sending and receiving messages will not work",
      });
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
        chatId,
      },
    };

    socket.send(JSON.stringify(messagePayload));
    messageContent = "";
  }
</script>

<section
  class="flex w-full flex-col gap-5 rounded-md border-2 border-accent p-5"
>
  <div bind:this={messageContainer} class="h-36 overflow-auto">
    <div class="flex w-[96%] flex-col gap-3">
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

    <Button on:click={sendMessageHandler}>
      <SendHorizontal class="text-white" />
    </Button>
  </div>
</section>
