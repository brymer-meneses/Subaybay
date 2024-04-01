<script lang="ts">
  export let roomId: string;

  import { onMount } from "svelte";
  import ChatMessage from "./ChatMessage.svelte";
  import { ScrollArea } from "bits-ui";
  import { BxsSend } from "svelte-boxicons";

  import { afterUpdate } from "svelte";

  type Message = {
    time: number;
    content: string;
    from: string;
  };

  const name: string = "example@up.edu.ph";
  let messages: Array<Message> = [];
  let socket: WebSocket;
  let messageContent: string;

  let messagesContainer: HTMLDivElement;

  onMount(async () => {
    const response = await fetch(
      `http://localhost:8080/chat/messages?roomId=${roomId}`,
      {
        method: "GET",
      },
    );
    messages = await response.json();

    // TODO: should encode roomId somehow
    // probably in this format: requestId-step
    socket = new WebSocket(`ws://localhost:8080/chat/ws?roomId=${roomId}`);
    socket.onmessage = receiveMessageHandler;

    scrollToBottom(messagesContainer);
  });

  afterUpdate(() => {
    if (messages) scrollToBottom(messagesContainer);
  });

  async function scrollToBottom(node: HTMLDivElement) {
    node.scroll({ top: node.scrollHeight, behavior: "smooth" });
  }

  async function receiveMessageHandler(event: any) {
    try {
      let message: Message = JSON.parse(event.data);
      messages = [...messages, message];
    } catch (err: any) {
      console.error("Invalid data: ", err.message);
    }
  }

  async function sendMessageHandler() {
    socket.send(JSON.stringify({ from: name, content: messageContent }));
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
          {#each messages as message, index}
            <ChatMessage
              message={message.content}
              byYou={message.from == null ? true : false}
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
      <BxsSend />
    </button>
  </div>
</section>
