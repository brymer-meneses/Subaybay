<script lang="ts">
  import { onMount } from "svelte";
  import * as d3 from "d3";
  var data = [30, 86, 168, 281, 303, 109];

  let el;

  onMount(() => {
    d3.select(el)
      .selectAll("div")
      .data(data)
      .enter()
      .append("div")
      .style("width", function (d) {
        return d + "px";
      })
      .text(function (d) {
        return d;
      });
  });
</script>

<div bind:this={el} class="chart"></div>

<style>
  .chart :global(div) {
    font: 10px sans-serif;
    background-color: steelblue;
    text-align: right;
    padding: 3px;
    margin: 1px;
    color: white;
  }
</style>
