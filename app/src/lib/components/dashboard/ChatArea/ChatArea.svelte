<script lang="ts">
  export let roomId: string;

  import { onMount } from "svelte";
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

  async function receiveMessageHandler(event: any) {
    // the first message passed by the socket is all the previous messages
    if (firstTime) {
      messages = JSON.parse(event.data);
      firstTime = false;
      return;
    }

    try {
      let message: Message = JSON.parse(event.data);
      messages = [...messages, message];
    } catch (err: any) {
      console.error("Invalid data: ", err.message);
    }
  }

  async function sendMessageHandler() {
    const messagePayload: MessagePayload = { content: messageContent, userId };
    socket.send(JSON.stringify(messagePayload));
  }
</script>

<section
  class="bg-pale-red-100 w-full h-full rounded-3xl flex flex-col p-5 gap-5"
>
  <ScrollArea.Root class="relative h-full w-full px-4 flex">
    <!-- block is needed here for this weird bug? https://git.histb.com/melt-ui/melt-ui/discussions/1093 -->
    <ScrollArea.Viewport class="w-full h-full [&>div]:!block">
      <ScrollArea.Content>
        <div class="flex flex-col gap-3">
          {#each messages as message, _}
            <ChatMessage
              message={message.content}
              byYou={message.userId == userId ? true : false}
              dateTime={message.dateTime}
              profileUrl={message.profileUrl}
            />
          {/each}
        </div>
      </ScrollArea.Content>
    </ScrollArea.Viewport>

    <ScrollArea.Scrollbar
      orientation="vertical"
      class="flex h-full w-2.5 touch-none select-none rounded-full border-l border-l-transparent p-px transition-all hover:w-3 hover:bg-dark-10"
    >
      <ScrollArea.Thumb
        class="relative flex-1 rounded-full bg-muted-foreground opacity-40 bg-pale-red-300 transition-opacity hover:opacity-100"
      />
    </ScrollArea.Scrollbar>
    <ScrollArea.Corner />
  </ScrollArea.Root>

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
