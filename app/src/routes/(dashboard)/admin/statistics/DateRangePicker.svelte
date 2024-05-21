<script lang="ts">
  import CalendarIcon from "lucide-svelte/icons/calendar";
  import {
    DateFormatter,
    type DateValue,
    getLocalTimeZone,
  } from "@internationalized/date";
  import { cn } from "$lib/utils.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import BetterCalendar from "./BetterCalendar.svelte";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { createEventDispatcher } from "svelte";

  const df = new DateFormatter("en-US", {
    dateStyle: "long",
  });

  let date: DateValue | undefined = undefined;

  const dispatcher = createEventDispatcher();
  $: {
    dispatcher("dateSelect", date);
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
      {date ? df.format(date.toDate(getLocalTimeZone())) : "Pick a Date"}
    </Button>
  </Popover.Trigger>
  <Popover.Content class="flex w-auto p-0">
    <BetterCalendar bind:value={date} initialFocus />
  </Popover.Content>
</Popover.Root>
