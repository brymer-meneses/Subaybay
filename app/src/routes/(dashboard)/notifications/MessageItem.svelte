<script lang="ts">
  import type { MessageNotificationData } from "./types";

  import { Button } from "$lib/components/ui/button/index.js";
  import * as Avatar from "$lib/components/ui/avatar";

  import MessageIcon from "lucide-svelte/icons/message-square-dot";

  import dayjs from "dayjs";
  import relativeTime from "dayjs/plugin/relativeTime";
  import clsx from "clsx";

  dayjs.extend(relativeTime);

  export let data: MessageNotificationData;

  const time = dayjs.unix(data.message.dateTime);

  const currentStage =
    data.requestType.stages[data.request.currentStage.stageTypeIndex];
</script>

<Button
  class={clsx(
    "flex h-min w-full justify-between gap-3 rounded-lg border border-input bg-background p-4 text-accent-foreground hover:bg-accent/100",
    data.seen ? "opacity-60" : "bg-background",
  )}
  type="submit"
>
  <MessageIcon />
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

        <span>{data.from.name}: {data.message.content}</span>
      </div>

      <span class="text-xs font-light text-black">{dayjs(time).fromNow()}</span>
    </div>
  </div>
</Button>
