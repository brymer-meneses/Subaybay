<script lang="ts">
  import type { RequestType, User } from "$lib/server/database";
  import * as Avatar from "$lib/components/ui/avatar/index";
  import { createEventDispatcher } from "svelte";
  import { Button } from "$lib/components/ui/button";
  import { X, CircleChevronRight } from "lucide-svelte";
  import { goto } from "$app/navigation";

  export let from: User;
  export let request: any;
  export let requestType: RequestType;
  export let type: "pass" | "reassign" | "rollback";

  const dispatch = createEventDispatcher();
</script>

<div
  class="mr-[14rem] flex h-[75px] w-full flex-row items-center justify-between gap-2 overflow-hidden rounded-full pb-5 pl-3 pr-3 pt-5"
>
  <div class="flex flex-row items-center gap-4">
    <Avatar.Root class="h-7 w-7">
      <Avatar.Image src={from.profileUrl} alt="sender" />
      <Avatar.Fallback>CN</Avatar.Fallback>
    </Avatar.Root>
    <div class="w-full overflow-hidden">
      <p class="text-sm text-muted-foreground">
        {from.name.split(" ")[0]}
        {type === "pass" ? "passed" : "reassigned"}
        a request to you.
      </p>
      <p class="text-xs text-muted-foreground">
        <strong>{requestType.title}</strong>
      </p>
      <p class="overflow-text-ellipsis text-xs text-muted-foreground">
        {requestType.stages[request.currentStage.stageTypeIndex].stageTitle}
      </p>
    </div>
  </div>
  <Button
    variant="ghost"
    on:click={() => dispatch("closeToast")}
    class="m-0 flex items-center rounded-full p-2"
  >
    <X size={18} />
  </Button>

  <Button
    variant="ghost"
    on:click={() => goto(`/requests/${request.id}`)}
    class="m-0 flex items-center rounded-full p-2"
  >
    <CircleChevronRight size={18} />
  </Button>
</div>
