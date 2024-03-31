<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  export let x1: number = 0,
    y1: number = 100;
  export let x2: number = 500,
    y2: number = 100;

  export let hoverText: string = "hover";
  export let hoverCircleRadius: number = 10;

  export let onClick: () => void = () => {};

  $: slope = (y2 - y1) / (x2 - x1);
  // todo export a callback?

  let line: any;
  let addButton: any;

  let hovered: boolean = false;
  let hoveredX: number;
  let hoveredY: number;

  let color = "black";
  let thickness = 3;

  onMount(() => {
    window.addEventListener("mousemove", handleMouseMove);
  });

  onDestroy(() => {
    window.removeEventListener("mousemove", handleMouseMove);
  });

  function handleMouseMove(e: any) {
    if (!hovered) return;

    hoveredX = e.clientX - line.getBoundingClientRect().left + x1;
    hoveredY = slope * (hoveredX - x1) + y1;
  }

  function handleMouseOver(e: any) {
    hovered = true;

    color = "green";
    thickness = 6;
  }

  function handleMouseOut(e: any) {
    hovered = false;
    color = "black";
    thickness = 3;
  }

  function handleClick() {
    onClick();
  }
</script>

<g>
  <!-- Hitbox -->
  <!-- svelte-ignore a11y-mouse-events-have-key-events svelte-ignore a11y-click-events-have-key-events svelte-ignore a11y-no-static-element-interactions svelte-ignore a11y-mouse-events-have-key-events -->
  <line
    {x1}
    {y1}
    {x2}
    {y2}
    stroke="transparent"
    stroke-width={40}
    on:mouseover={handleMouseOver}
    on:mouseout={handleMouseOut}
    on:click={handleClick}
  />

  <line
    bind:this={line}
    {x1}
    {y1}
    {x2}
    {y2}
    stroke={color}
    stroke-width={thickness}
    style="pointer-events: none;"
  />

  {#if hovered}
    <circle
      bind:this={addButton}
      r={hoverCircleRadius}
      cx={hoveredX}
      cy={hoveredY}
      style="pointer-events: none;"
    ></circle>
    <text
      x={hoveredX}
      y={hoveredY - hoverCircleRadius}
      text-anchor="middle"
      dominant-baseline="text-after-edge"
      style="pointer-events: none;"
    >
      {hoverText}
    </text>
  {/if}
</g>
