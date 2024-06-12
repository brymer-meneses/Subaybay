<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Avatar from "$lib/components/ui/avatar";

  import MessageCircle from "lucide-svelte/icons/message-circle";

  import dayjs from "dayjs";
  import relativeTime from "dayjs/plugin/relativeTime";
  dayjs.extend(relativeTime);

  import type { InboxNotificationData } from "./types";
  import { goto } from "$app/navigation";
  import clsx from "clsx";

  export let isSelected: boolean;
  export let data: InboxNotificationData;

  const time = dayjs.unix(data.date);

  const currentStage =
    data.requestType.stages[data.request.currentStage.stageTypeIndex];
</script>

<Button
  class={clsx(
    "flex h-min w-full justify-between gap-3 rounded-lg border border-input bg-background p-4 hover:bg-accent/100 hover:text-accent-foreground",
    data.seen ? "opacity-60" : "bg-background",
  )}
  on:click={() => {
    goto("/requests/" + data.request._id);
  }}
>
  <MessageCircle class="text-primary" />
  <div class="flex w-full flex-col items-start gap-2">
    <div
      class="flex w-full flex-row justify-between gap-2 text-xs text-muted-foreground"
    >
      <div class="flex flex-col items-start">
        <span class="text-sm font-semibold">
          {data.request.studentName}{data.request.studentName.endsWith("s")
            ? "'"
            : "'s"}
          <span class="font-normal">
            {data.requestType.title}
          </span>
        </span>
        <span>
          Step 2: {currentStage.stageTitle}
        </span>
      </div>
      <p>{data.request._id}</p>
    </div>
    <div class="flex w-full flex-row items-center justify-between gap-2">
      <!-- container -->
      <div class="flex flex-row items-center gap-2">
        <Avatar.Root class="h-4 w-4">
          <Avatar.Image src={data.from.profileUrl} alt="profileUrl" />
          <Avatar.Fallback>CN</Avatar.Fallback>
        </Avatar.Root>

        <span class="text-primary">{data.from.name}</span>
      </div>

      <span class="text-xs font-light text-black">{dayjs(time).fromNow()}</span>
    </div>
  </div>
</Button>
