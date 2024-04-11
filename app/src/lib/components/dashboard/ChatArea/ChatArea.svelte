<script lang="ts">
  export let roomId: string;

  import { onMount, tick } from "svelte";
  import ChatMessage from "./ChatMessage.svelte";
  import { ScrollArea } from "bits-ui";
  import { BxsSend } from "svelte-boxicons";

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

  export let userId: string;
  export let sessionId: string;

  let messages: Array<Message> = [];
  let socket: WebSocket;
  let firstTime = true;
  let messageContent: string;

  let messageContainer: HTMLDivElement;

  onMount(async () => {
    // TODO: should encode roomId somehow
    // probably in this format: requestId-step
    socket = new WebSocket(
      `ws://localhost:8080/chat/${roomId}/ws?sessionId=${sessionId}`,
    );

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
  }
</script>

<section
  class="bg-pale-red-100 w-full h-full rounded-3xl flex flex-col p-5 gap-5"
>
  <div bind:this={messageContainer} class="overflow-auto h-full">
    <div class="flex flex-col gap-3 w-[96%]">
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

  <div
    class="w-full h-12 rounded-2xl bg-white p-3 flex items-center drop-shadow-sm"
  >
    <input
      class="w-full h-full border-none focus:ring-0 focus:ring-offset-0"
      placeholder="Send a message ..."
      bind:value={messageContent}
    />

    <button on:click={sendMessageHandler}>
      <BxsSend class="text-primary" />
    </button>
  </div>
</section>
