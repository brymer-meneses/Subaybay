<script lang="ts">
  import { onMount, tick } from "svelte";
  import { page } from "$app/stores";
  import { toast } from "svelte-sonner";

  import ChatMessage from "./ChatMessage.svelte";
  import SendHorizontal from "lucide-svelte/icons/send-horizontal";
  import { Input } from "$lib/components/ui/input";
  import { Button } from "$lib/components/ui/button";

  type Message = {
    dateTime: number;
    content: string;
    userId: string;
    profileUrl: string;
  };

  type MessagePayload = {
    content: string;
    userId: string;
  };

  export let roomId: string;

  $: userId = $page.data.userInfo.id;
  $: sessionId = $page.data.sessionId;

  let messages: Array<Message> = [];
  let socket: WebSocket;
  let firstTime = true;
  let messageContent: string;

  let messageContainer: HTMLDivElement;

  onMount(async () => {
    // TODO: should encode roomId somehow
    // probably in this format: requestId-step
    socket = new WebSocket(`ws://localhost:8080/chat/${roomId}/ws`);
    socket.onerror = () => {
      toast.error("Failed to connect to the chat server", {
        description: "Sending and receiving messages will not work",
      });
    };
    socket.onopen = () => {
      socket.send(sessionId);
    };

    socket.onmessage = receiveMessageHandler;
  });

  async function scrollToBottom(node: HTMLDivElement) {
    node.scroll({ top: node.scrollHeight, behavior: "smooth" });
  }

  async function receiveMessageHandler(event: any) {
    // the first message passed by the socket is all the previous messages
    if (firstTime) {
      messages = JSON.parse(event.data);
      firstTime = false;

      await tick();
      scrollToBottom(messageContainer);
      return;
    }

    try {
      let message: Message = JSON.parse(event.data);
      messages = [...messages, message];
    } catch (err: any) {
      console.error("Invalid data: ", err.message);
    }

    await tick();
    scrollToBottom(messageContainer);
  }

  async function sendMessageHandler() {
    const messagePayload: MessagePayload = { content: messageContent, userId };
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
