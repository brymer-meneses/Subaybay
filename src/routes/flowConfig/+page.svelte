<script lang="ts">
    import NodeButton from '$lib/components/requestFlow/nodeButton.svelte';
    import NodeLine from '$lib/components/requestFlow/nodeLine.svelte';
    import {onMount} from 'svelte';

    type Point = {
        x : number;
        y : number;
    }
  
    let readyToRender = false;
    let graph : any;

    let graphWidth : number;
	let graphHeight : number;

    let linearStageCount : number = 6; // how to make automatic?

	const margin = {
		top: 20,
		right: 30,
		bottom: 30,
		left: 30
	};
    const radius = 20;
    const ySpacing = 100;
    
    // move this??
    let xSpacing : number;
    let lineStart : number;
    let lineEnd : number;
    let center : Point;

    // todo: make this not harcoded 
        // actually, it's gonna start as just the initial leading to the end then it mutates as 
        // the user adds nodes

    // this stores the connection between stages
    // Note: this assumes that a stage cannot be repeated twice, 
        // make sure to add code to account for this when adding new stages
        // todo: add Blank stage
    const flow: { [key: string]: string[]} = {};
    flow["initial"] = ["staff 1"];
    flow["staff 1"] = ["staff 2", "staff 3"];
    flow["staff 2"] = ["staff 2A"];
    flow["staff 3"] = ["staff 3A"];
    flow["staff 2A"] = ["UR"];
    flow["staff 3A"] = ["UR"];
    flow["UR"] = ["final"];

    // todo: look into reducing the amount of data structures here
    // this links a stage to its point
    let stageToPoint : {[key: string]: Point} = {};

    let layers : string[][];

    onMount(() => {
        console.log("On Mount");
        recompute();
        window.addEventListener('resize', recompute);
    });
    
    // Todo: Clean Up
        // How organize this 
    function recompute(): void {
        console.log("Recompute");
        graphWidth = graph.getBoundingClientRect().width;
		graphHeight = graph.getBoundingClientRect().height;

        center = { x : graphWidth / 2, y : graphHeight / 2};
        lineStart = margin.left;
        lineEnd = graphWidth - margin.right;
        xSpacing = (lineEnd - lineStart) / (linearStageCount - 1);

        stageToPoint = {};

        resetLayers();

        readFlow("initial", 0);

        createPoints();
    }

    function resetLayers() {
        layers = [];
        for(let i = 0; i < linearStageCount; i++) {
            layers.push([]);
        }
    }

    // Create Layers list
    function readFlow(stage : string, pos : number) {
        addToLayer(pos, stage);
        
        let nextStages = flow[stage];
        if(!nextStages) return;

        for(const stage of nextStages) {
            readFlow(stage, pos + 1);
        }
    }

    function addToLayer(index : number, element : string) {            
        let layer = layers[index];
        if(layer.indexOf(element) != -1) return;
        layer.push(element);
    }

    function createPoints() {
        //todo find a way to ensure order is preserved
        for(let pos = 0; pos < linearStageCount; pos++) {
            let layer = layers[pos];
            const x = lineStart + pos * xSpacing
            const y0 = center.y - (((layer.length - 1) / 2) * ySpacing); //trust me

            for(let i = 0; i < layer.length; i++) {
                const y = y0 + (i * ySpacing);
                addPoint(x, y, layer[i]);
            }
            
            //todo do something with first pos = 0 and last pos = layers.Count - 1
        }
    }

    function addPoint(x : number, y : number, stage : string) {
        const point : Point = { x : x, y : y};
        stageToPoint[stage] = point;
    }

    function createNewStage(from : string, to : string) {
        const isParallelAddition = flow[from].indexOf(to) == -1;

        let newStage = "newStage" + linearStageCount; //todo create function to generate the name
        
        if(!isParallelAddition) {
            const i = flow[from].indexOf(to);
            flow[from].splice(i);

            linearStageCount = linearStageCount + 1;
        }
        
        flow[from].push(newStage);
        flow[newStage] = [to];

        recompute();
    }

</script>

<div class="flex justify-center border-blue border-4">
    <div class="border-2 border-black justify-center w-[100%] max-w-[800px] h-[500px]">
        <svg id="graph" viewBox="0 0 {graphWidth} {graphHeight}" width=100% bind:this={graph}>
            <g>
                {#if Object.keys(stageToPoint).length > 0} 
                    {#each Object.keys(flow) as start}
                        {#each flow[start] as end}
                            <NodeLine 
                                x1={stageToPoint[start].x} 
                                y1={stageToPoint[start].y} 
                                x2={stageToPoint[end].x} 
                                y2={stageToPoint[end].y}
                                addNodeFunction = {() => createNewStage(start, end)}
                            ></NodeLine>
                        {/each}
                    {/each}
                {/if}
            </g>
            
            <g>
                {#if Object.keys(stageToPoint).length > 0}
                    {#each Object.values(stageToPoint) as point}
                        <NodeButton cx={point.x} cy={point.y} r={radius}></NodeButton>
                    {/each}
                {/if}
            </g>
        </svg>
    </div>  
</div>