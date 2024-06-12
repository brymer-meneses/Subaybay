<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Avatar from "$lib/components/ui/avatar";
  import * as Card from "$lib/components/ui/card";

  import dayjs from "dayjs";
  import relativeTime from "dayjs/plugin/relativeTime";
  dayjs.extend(relativeTime);

  import type { MessageNotificationData } from "./types";
  import { goto } from "$app/navigation";

  export let isSelected: boolean;
  export let data: MessageNotificationData;

  const time = dayjs.unix(data.message.dateTime);

  const currentStage =
    data.requestType.stages[data.request.currentStage.stageTypeIndex];
</script>

<Button
  class="flex h-min w-full  justify-between gap-2 rounded-lg p-4"
  variant={isSelected ? "secondary" : "outline"}
  on:click={() => {
    goto("/requests/" + data.request._id);
  }}
>
  <div class="flex w-full flex-col items-start gap-2">
    <div
      class="flex w-full flex-row justify-between gap-2 text-xs text-muted-foreground"
    >
      <div class="flex flex-col items-start">
        <span class="text-sm font-semibold">{data.requestType.title}</span>
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
        <p>{data.from.name}</p>
        <p>{data.message.content}</p>
      </div>

      <span class="text-xs">{dayjs(time).fromNow()}</span>
    </div>
  </div>

  <!-- <div class="flex items-center gap-4"> -->
  <!---->
  <!--   <p>{data.message.content}</p> -->
  <!-- </div> -->
  <!--   <p>{data.requestType.title}</p> -->
  <!-- <p class="text-xs">{date.toLocaleString()}</p> -->
</Button>
