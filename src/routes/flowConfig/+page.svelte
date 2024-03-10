<script lang="ts">
  import NodeButton from "$lib/components/requestFlow/nodeButton.svelte";
  import NodeLine from "$lib/components/requestFlow/nodeLine.svelte";
  import { onMount } from "svelte";

  type Point = {
    x: number;
    y: number;
  };

  let graph: any;

  let graphWidth: number;
  let graphHeight: number;

  const margin = {
    top: 20,
    right: 30,
    bottom: 30,
    left: 30,
  };
  const radius = 20;
  const ySpacing = 100;

  // todo: make this not harcoded
  // actually, it's gonna start as just the initial leading to the end then it mutates as
  // the user adds nodes

  // this stores the connection between stages
  // Note: this assumes that a stage cannot be repeated twice,
  // make sure to add code to account for this when adding new stages
  // todo: add Blank stage
  // const flow: { [key: string]: string[]} = {};
  // flow["initial"] = ["staff 1"];
  // flow["staff 1"] = ["staff 2", "staff 3"];
  // flow["staff 2"] = ["staff 2A"];
  // flow["staff 3"] = ["staff 3A"];
  // flow["staff 2A"] = ["UR"];
  // flow["staff 3A"] = ["UR"];
  // flow["UR"] = ["final"];

  const flow: { [key: string]: string[] } = {};
  flow["initial"] = ["a1", "b1"];
  flow["a1"] = ["a2"];
  flow["b1"] = ["b2"];
  flow["a2"] = ["c"];
  flow["c"] = ["final"];
  flow["b2"] = ["c"];

  // todo: look into reducing the amount of data structures here
  // this links a stage to its point
  let stageToPoint: { [key: string]: Point } = {};

  let layers: string[][];

  onMount(() => {
    console.log("On Mount");
    recompute();
    window.addEventListener("resize", recompute);
  });

  // Todo: Clean Up
  // How organize this
  function recompute(): void {
    console.log("Recompute");
    graphWidth = graph.getBoundingClientRect().width;
    graphHeight = graph.getBoundingClientRect().height;

    stageToPoint = {};

    layers = [];

    readFlow();

    let lineStart = margin.left;
    let lineEnd = graphWidth - margin.right;
    let center = { x: graphWidth / 2, y: graphHeight / 2 };
    let xSpacing = (lineEnd - lineStart) / (layers.length - 1);

    createPoints(lineStart, center, xSpacing);
  }

  // Create Layers list
  // todo: see if a depth first search also works, it might be more efficient
  function readFlow() {
    type Item = { stage: string; pos: number };
    let queue: Item[] = [];
    const initial = { stage: "initial", pos: 0 };
    queue.push(initial);

    while (true) {
      const current = queue.shift();
      if (!current) return;

      console.log("Current: " + current.stage);
      addToLayer(current.pos, current.stage);

      const nextStages = flow[current.stage];
      if (!nextStages) continue; //?this only addresses "final" I think?

      for (const stage of nextStages) {
        console.log("Queuing: " + stage);
        queue.push({ stage: stage, pos: current.pos + 1 });
      }
    }
  }

  // todo: we also need to keep track of lines I think AHAHHAHAHA, so many considerations !!!

  function addToLayer(index: number, element: string) {
    ensureLayerSize(index);
    // remove the element if it was already placed in a previous layer
    for (let i = 0; i < index; i++) {
      const elementIndex = layers[i].indexOf(element);
      if (elementIndex != -1) {
        console.log("Removing " + element);
        layers[i].splice(elementIndex, 1);
        break;
      }
    }

    // place the element if it isn't already in this layer or a future one
    let exists = false;
    for (let i = index; i < layers.length; i++) {
      const elementIndex = layers[i].indexOf(element);
      if (elementIndex != -1) {
        exists = true;
        console.log("Not re-adding" + element);
        break;
      }
    }

    if (!exists) {
      console.log("Adding " + element);
      layers[index].push(element);
    }
  }

  function ensureLayerSize(requiredIndex: number) {
    const maxIndex = layers.length - 1;
    if (maxIndex >= requiredIndex) return;

    for (let i = maxIndex; i < requiredIndex; i++) {
      layers.push([]);
    }
  }

  function createPoints(lineStart: number, center: Point, xSpacing: number) {
    //todo find a way to ensure order is preserved
    for (let pos = 0; pos < layers.length; pos++) {
      let layer = layers[pos];
      const x = lineStart + pos * xSpacing;
      const y0 = center.y - ((layer.length - 1) / 2) * ySpacing; //trust me

      for (let i = 0; i < layer.length; i++) {
        const y = y0 + i * ySpacing;
        addPoint(x, y, layer[i]);
      }

      //todo do something with first pos = 0 and last pos = layers.Count - 1
    }
  }

  function addPoint(x: number, y: number, stage: string) {
    const point: Point = { x: x, y: y };
    stageToPoint[stage] = point;
  }

  function createNewStage(from: string, to: string) {
    const isLinearAddition = flow[from].indexOf(to) != -1;

    let newStage = generateRandomStageName("New Stage ");

    if (isLinearAddition) {
      const i = flow[from].indexOf(to);
      flow[from][i] = newStage;
      flow[newStage] = [to];
      console.log("Is Linear");
    } else {
      console.log("Is Parallel");
    }

    console.log(from + " - " + to);

    recompute();
  }

  function generateRandomStageName(base: string): string {
    let n = 1;
    while (base + n in flow) {
      n++;
    }
    return base + n;
  }
</script>

<div class="flex justify-center border-blue border-4 h-[600px]">
  <div
    bind:this={graph}
    class="border-2 border-black justify-center w-[100%] max-w-[800px] h-[100%]"
  >
    <svg viewBox="0 0 {graphWidth} {graphHeight}" width="100%">
      <g>
        {#if Object.keys(stageToPoint).length > 0}
          {#each Object.keys(flow) as start}
            {#each flow[start] as end}
              <NodeLine
                x1={stageToPoint[start].x}
                y1={stageToPoint[start].y}
                x2={stageToPoint[end].x}
                y2={stageToPoint[end].y}
                onClick={() => createNewStage(start, end)}
              ></NodeLine>
            {/each}
          {/each}
        {/if}
      </g>

      <g>
        {#if Object.keys(stageToPoint).length > 0}
          {#each Object.entries(stageToPoint) as [stage, point]}
            <NodeButton cx={point.x} cy={point.y} r={radius} text={stage}
            ></NodeButton>
          {/each}
        {/if}
      </g>
    </svg>
  </div>
</div>
