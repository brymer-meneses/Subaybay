<script lang="ts">
  import CalendarIcon from "lucide-svelte/icons/calendar";
  import type { DateRange } from "bits-ui";
  import {
    CalendarDate,
    DateFormatter,
    type DateValue,
    getLocalTimeZone,
  } from "@internationalized/date";
  import { cn } from "$lib/utils.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { RangeCalendar } from "$lib/components/ui/range-calendar/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";

  export let startDate: Date = new Date();
  export let endDate: Date = new Date();
  export let range: {
    days: number;
    weeks: number;
    months: number;
    years: number;
  };
  const df = new DateFormatter("en-US", {
    dateStyle: "medium",
  });

  let value: DateRange | undefined = {
    start: new CalendarDate(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDay(),
    ),
    end: new CalendarDate(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDay(),
    ).add({
      days: range.days,
      weeks: range.weeks,
      months: range.months,
      years: range.years,
    }),
  };

  $: {
    value = {
      start: new CalendarDate(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDay(),
      ),
      end: new CalendarDate(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDay(),
      ).add({
        days: range.days,
        weeks: range.weeks,
        months: range.months,
        years: range.years,
      }),
    };
  }

  let startValue: DateValue | undefined = undefined;
</script>

<div class="grid gap-2">
  <Popover.Root openFocus>
    <Popover.Trigger asChild let:builder>
      <Button
        variant="outline"
        class={cn(
          "w-[300px] justify-start text-left font-normal",
          !value && "text-muted-foreground",
        )}
        builders={[builder]}
      >
        <CalendarIcon class="mr-2 h-4 w-4" />
        {#if value && value.start}
          {#if value.end}
            {df.format(value.start.toDate(getLocalTimeZone()))} - {df.format(
              value.end.toDate(getLocalTimeZone()),
            )}
          {:else}
            {df.format(value.start.toDate(getLocalTimeZone()))}
          {/if}
        {:else if startValue}
          {df.format(startValue.toDate(getLocalTimeZone()))}
        {:else}
          Pick a date
        {/if}
      </Button>
    </Popover.Trigger>
    <Popover.Content class="w-auto p-0" align="start">
      <RangeCalendar
        bind:value
        bind:startValue
        initialFocus
        numberOfMonths={1}
        placeholder={value?.start}
      />
    </Popover.Content>
  </Popover.Root>
</div>
