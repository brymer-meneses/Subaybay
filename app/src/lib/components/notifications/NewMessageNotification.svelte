<script lang="ts">
  import type { Message, Request, User } from "$lib/server/database";
  import * as Avatar from "$lib/components/ui/avatar/index";
  import { createEventDispatcher } from "svelte";
  import { Button } from "$lib/components/ui/button";
  import X from "lucide-svelte/icons/x";

  export let message: Message;
  export let request: Request;
  export let from: User;

  const dispatch = createEventDispatcher();
</script>

<div
  class="relative flex h-[50px] w-[370px] flex-row items-center justify-between gap-2 rounded-full p-3"
>
  <div class="flex flex-row items-center gap-4">
    <Avatar.Root class="h-5 w-5">
      <Avatar.Image src={from.profileUrl} alt="sender" />
      <Avatar.Fallback>CN</Avatar.Fallback>
    </Avatar.Root>
    <p class="text-md text-muted-foreground">{message.content}</p>
  </div>

  <Button
    variant="secondary"
    on:click={() => dispatch("closeToast")}
    class="absolute left-[-10px] top-[-10px] flex items-center justify-center rounded-full p-0 opacity-80"
  >
    <X size={10} />
  </Button>
</div>
