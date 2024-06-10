<script lang="ts">
  import { scaleLinear } from "d3-scale";

  export let data: { date: Date; value: number }[];

  const breakPoint = 640;
  let width = 1320;
  let height = 300;

  const xTicks = data.map((d) => d.date);
  let yTicks: number[] = [];
  let padding = { top: 20, right: 15, bottom: 20, left: 45 };

  const minUB = 25;
  const UB =
    minUB + minUB * Math.floor(Math.max(...data.map((d) => d.value)) / minUB);

  for (let i = 0; i <= 5; i++) {
    yTicks.push(Math.round(i * (UB / 5)));
  }

  $: padding =
    width > breakPoint
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
    let d = date.toLocaleString("en-US", { month: "short", day: "numeric" });
    return d;
  }
</script>

<!-- <p>{JSON.stringify(data, null, 2)}</p> -->
<div
  class="chart m-0 w-full sm:border-b md:border-none lg:-ml-2"
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
    {#if width > breakPoint}
      <line
        x1={padding.left}
        y1={padding.top - 25}
        x2={padding.left}
        y2={height - padding.bottom}
        stroke="#ccc"
        stroke-width="1"
      />
    {/if}

    <!-- x-axis line -->
    <line
      x1={padding.left}
      y1={height - padding.bottom}
      x2={width - padding.right}
      y2={height - padding.bottom}
      stroke="#ccc"
      stroke-width="1"
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
          stroke-width="0.5"
        />
      {/each}
    </g>

    <!-- y-axis labels -->
    {#if width > breakPoint}
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
              <tspan x="36" dy="0.355em" font-weight="bold">{tick}</tspan>
            </text>
          </g>
        {/each}
      </g>
    {/if}

    <!-- x-axis labels -->
    {#if width > breakPoint}
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
              ><tspan x={barWidth / 2} dy="0.71em" font-weight="bold"
                >{i === 13 ? "Today" : formatDate(point.date)}</tspan
              ></text
            >
          </g>
        {/each}
      </g>
    {/if}

    <!-- data -->

    <g>
      {#each data as point, i}
        {#if width > breakPoint}
          <rect
            class="bg-primary-foregroundxx max-w-[51px]"
            x={xScale(i) + barWidth / 4}
            y={yScale(point.value)}
            width={barWidth / 2}
            height={yScale(0) - yScale(point.value)}
            fill="currentColor"
            rx="4"
            ry="4"
          />
          <text
            stroke="none"
            font-size="10"
            orientation="bottom"
            width="531"
            height="30"
            x={xScale(i) + barWidth / 4}
            y={yScale(point.value)}
            fill="#111111"
            text-anchor="middle"
            ><tspan x={xScale(i) + barWidth / 2} dy="-0.5em"
              >{point.value === 0 ? "" : point.value}</tspan
            ></text
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
