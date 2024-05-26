<script lang="ts">
  import type { Message, Request, User } from "$lib/server/database";
  import * as Avatar from "$lib/components/ui/avatar/index";
  import { createEventDispatcher } from "svelte";
  import { Button } from "$lib/components/ui/button";
  import { X } from "lucide-svelte";

  export let message: Message;
  export let request: Request;
  export let from: User;

  const dispatch = createEventDispatcher();
</script>

<div
  class="flex h-[50px] w-[370px] flex-row items-center justify-between gap-2 rounded-full p-3"
>
  <div class="flex flex-row items-center gap-4">
    <Avatar.Root class="h-7 w-7">
      <Avatar.Image src={from.profileUrl} alt="sender" />
      <Avatar.Fallback>CN</Avatar.Fallback>
    </Avatar.Root>
    <p class="text-md text-muted-foreground">
      {from.name.split(" ")[0]} sent you a message.
    </p>
  </div>

  <Button
    variant="ghost"
    on:click={() => dispatch("closeToast")}
    class="flex items-center rounded-full"
  >
    <X size={18} />
  </Button>
</div>
