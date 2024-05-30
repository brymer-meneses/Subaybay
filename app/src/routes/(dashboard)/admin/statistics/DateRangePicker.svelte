<script lang="ts">
  // import { Value } from "@internationalized/date";
  import CalendarIcon from "lucide-svelte/icons/calendar";
  import {
    DateFormatter,
    CalendarDate,
    type DateValue,
    getLocalTimeZone,
  } from "@internationalized/date";
  import { cn } from "$lib/utils.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import BetterCalendar from "./BetterCalendar.svelte";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { createEventDispatcher } from "svelte";
  export let minDate: Date | null;
  export let type: "start" | "end";

  const df = new DateFormatter("en-US", {
    dateStyle: "long",
  });

  let date: DateValue | undefined = undefined;

  const dispatcher = createEventDispatcher();
  $: {
    dispatcher("dateSelect", date);
  }

  $: {
    if (type === "end" && date != undefined && minDate?.getTime() === 0) {
      date = undefined;
    }

    // if (minDate) {
    //   date = new CalendarDate(
    //     minDate.getFullYear(),
    //     minDate.getMonth() + 1, // Month is 0-based in JS Date
    //     minDate.getDate(),
    //   );
    // }
  }
</script>

<Popover.Root>
  <Popover.Trigger asChild let:builder>
    <Button
      variant="outline"
      class={cn(
        "w-[280px] justify-start text-left font-normal",
        !date && "text-muted-foreground",
      )}
      builders={[builder]}
    >
      <CalendarIcon class="mr-2 h-4 w-4" />
      {#if minDate && minDate?.getTime() > 0 && !date}
        {df.format(minDate)}
      {:else if minDate && date && minDate?.getTime() >= date
            ?.toDate(getLocalTimeZone())
            .getTime()}
        {df.format(minDate)}
      {:else}
        {date ? df.format(date.toDate(getLocalTimeZone())) : "Pick a Date"}
      {/if}
    </Button>
  </Popover.Trigger>
  <Popover.Content class="flex w-auto p-0">
    <BetterCalendar bind:value={date} initialFocus {minDate} />
  </Popover.Content>
</Popover.Root>
