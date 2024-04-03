<script lang="ts">
  import dayjs from "dayjs";
  import relativeTime from "dayjs/plugin/relativeTime";
  import clsx from "clsx";

  dayjs.extend(relativeTime);

  export let message: string;
  export let byYou: boolean;
  export let dateTime: number;
  export let profileUrl: string;

  const color = byYou ? "bg-pale-yellow-100" : "bg-pale-red-600";
  const positionContainer = byYou ? "items-end" : "items-start";
  const positionBubble = byYou ? "justify-end" : "justify-start";

  const time = dayjs.unix(dateTime);
</script>

<div class={clsx("w-full flex flex-col justify-center", byYou && "items-end")}>
  <div
    class={clsx("w-full flex gap-2 items-center", byYou && "flex-row-reverse")}
  >
    <img
      src={profileUrl}
      alt="profile"
      class="w-6 h-6 rounded-full object-cover"
    />
    <div
      class={`rounded-2xl min-w-[10%] w-fit max-w-[80%] p-3 flex items-center ${color}`}
    >
      <p class="text-base font-light">{message}</p>
    </div>
  </div>
  <p class="text-xs text-gray-500">{dayjs(time).fromNow()}</p>
</div>
