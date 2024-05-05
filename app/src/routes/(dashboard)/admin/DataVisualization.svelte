<script lang="ts">
  import { scaleLinear } from "d3-scale";

  /**
   * Put this in +page.server.ts
   *
   * take date today
   * let daysAgo = (date today) - (current stage date finished )
   * if request.isFinished &&  days ago <=14
   * then
   *  find data[index].daysAgo === daysAgo, then value++;
   */

  const today = new Date();

  function subtractDays(date: Date, days: number) {
    const result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
  }

  const data = [
    { daysAgo: subtractDays(today, 13), value: 24 },
    { daysAgo: subtractDays(today, 12), value: 78 },
    { daysAgo: subtractDays(today, 11), value: 21 },
    { daysAgo: subtractDays(today, 10), value: 29 },
    { daysAgo: subtractDays(today, 9), value: 71 },
    { daysAgo: subtractDays(today, 8), value: 72 },
    { daysAgo: subtractDays(today, 7), value: 51 },
    { daysAgo: subtractDays(today, 6), value: 81 },
    { daysAgo: subtractDays(today, 5), value: 52 },
    { daysAgo: subtractDays(today, 4), value: 36 },
    { daysAgo: subtractDays(today, 3), value: 15 },
    { daysAgo: subtractDays(today, 2), value: 22 },
    { daysAgo: subtractDays(today, 1), value: 99 },
    { daysAgo: subtractDays(today, 0), value: 26 },
  ];

  let width = 1320;
  let height = 300;

  const xTicks = data.map((d) => d.daysAgo);
  let yTicks: number[] = [];
  let padding = { top: 20, right: 15, bottom: 20, left: 45 };

  const minUB = 25;
  const max =
    minUB + minUB * Math.floor(Math.max(...data.map((d) => d.value)) / minUB);

  for (let i = 0; i < 5; i++) {
    yTicks.push(i * (max / 4));
  }

  $: padding =
    width > 540
      ? { top: 20, right: 15, bottom: 20, left: 45 }
      : { ...padding, right: 0, left: 0 };

  $: xScale = scaleLinear()
    .domain([0, xTicks.length])
    .range([padding.left, width - padding.right]);

  $: yScale = scaleLinear()
    .domain([0, Math.max.apply(null, yTicks)])
    .range([height - padding.bottom, padding.top]);

  $: innerWidth = width - (padding.left + padding.right);
  $: barWidth = innerWidth / xTicks.length;

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
    }).format(date);
  }
</script>

<div
  class="chart m-0 w-full border-b lg:-ml-2 lg:border-none"
  bind:clientHeight={height}
  bind:clientWidth={width}
>
  <svg
    class="relative -mb-2 h-[300px] w-full"
    {width}
    {height}
    viewBox="0 0 {width} {height}"
  >
    <!-- y-axis line -->
    {#if width > 540}
      <line
        x1={padding.left}
        y1={padding.top - 25}
        x2={padding.left}
        y2={height - padding.bottom}
        stroke="#ccc"
        stroke-width="2"
      />
    {/if}

    <!-- x-axis line -->
    <line
      x1={padding.left}
      y1={height - padding.bottom}
      x2={width - padding.right}
      y2={height - padding.bottom}
      stroke="#ccc"
      stroke-width="2"
    />

    <!--Horizontal Grid lines -->
    <g>
      {#each yTicks as tick}
        <line
          x1={padding.left}
          y1={yScale(tick)}
          x2={width - padding.right}
          y2={yScale(tick)}
          stroke="#e5e5e5"
          stroke-width="1"
        />
      {/each}
    </g>

    <!-- y-axis labels -->
    {#if width > 540}
      <g class="axis y-axis">
        {#each yTicks as tick}
          <g class="text-xs" transform="translate(0, {yScale(tick)})">
            <text
              stroke="none"
              font-size="12"
              orientation="left"
              width="60"
              height="310"
              x="57"
              y="-4"
              fill="#111111"
              text-anchor="end"
            >
              <tspan x="36" dy="0.355em">{tick}</tspan>
            </text>
          </g>
        {/each}
      </g>
    {/if}

    <!-- x-axis labels -->
    {#if width > 540}
      <g class="axis x-axis">
        {#each data as point, i}
          <g class="text-xs" transform="translate({xScale(i)},{height + 5})">
            <text
              stroke="none"
              font-size="12"
              orientation="bottom"
              width="531"
              height="30"
              x={barWidth / 2}
              y="-15"
              fill="#111111"
              text-anchor="middle"
              ><tspan x={barWidth / 2} dy="0.71em"
                >{i === 13 ? "Today" : formatDate(point.daysAgo)}</tspan
              ></text
            >
          </g>
        {/each}
      </g>
    {/if}

    <!-- data -->
    <g>
      {#each data as point, i}
        {#if width > 540}
          <rect
            class="bg-primary-foreground max-w-[51px]"
            x={xScale(i) + 25}
            y={yScale(point.value)}
            width={barWidth / 2}
            height={yScale(0) - yScale(point.value)}
            fill="currentColor"
            rx="4"
            ry="4"
          />
          <text
            stroke="none"
            font-size="12"
            orientation="bottom"
            width="531"
            height="30"
            x={xScale(i) + 25}
            y={yScale(point.value)}
            fill="#111111"
            text-anchor="middle"
            ><tspan x={xScale(i) + 50} dy="-1em">{point.value}</tspan></text
          >
        {:else}
          <rect
            class="bg-primary-foreground max-w-[51px]"
            x={xScale(i) + 10}
            y={yScale(point.value)}
            width={barWidth / 2 - 5}
            height={yScale(0) - yScale(point.value)}
            fill="currentColor"
            rx="2"
            ry="2"
          />
        {/if}
      {/each}
    </g>
  </svg>
</div>
