<script lang="ts">
  import dayjs from "dayjs";
  import relativeTime from "dayjs/plugin/relativeTime";
  import clsx from "clsx";

  dayjs.extend(relativeTime);

  export let message: string;
  export let byYou: boolean;
  export let dateTime: number;
  export let profileUrl: string;

  const color = byYou ? "bg-muted-foreground text-white" : "bg-accent";
  const positionContainer = byYou ? "items-end" : "items-start";
  const positionBubble = byYou ? "justify-end" : "justify-start";

  const time = dayjs.unix(dateTime);
</script>

<div class={clsx("flex w-full flex-col justify-center", byYou && "items-end")}>
  <div
    class={clsx("flex w-full items-center gap-2", byYou && "flex-row-reverse")}
  >
    <img
      src={profileUrl}
      alt="profile"
      class="h-6 w-6 rounded-full object-cover"
    />
    <div
      class={`flex w-fit min-w-[10%] max-w-[80%] items-center break-all rounded-2xl p-3 ${color}`}
    >
      <p class="text-base font-light">{message}</p>
    </div>
  </div>
  <p class="text-xs text-gray-500">{dayjs(time).fromNow()}</p>
</div>
