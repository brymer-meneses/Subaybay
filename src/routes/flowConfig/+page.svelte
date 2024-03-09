<script lang="ts">
    import NodeButton from '$lib/components/requestFlow/nodeButton.svelte';
    import NodeLine from '$lib/components/requestFlow/nodeLine.svelte';
    import {onMount} from 'svelte';

    type Point = {
        x : number;
        y : number;
    }
  
    let graph : any;

    let graphWidth : number;
	let graphHeight : number;

    let linearStageCount : number = 6; // how to make automatic?
    let points : Point[] = []

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

    const flow: { [key: string]: string[]} = {};
    flow["initial"] = ["staff 1"];
    flow["staff 1"] = ["staff 2", "staff 3"];
    flow["staff 2"] = ["staff 2A"];
    flow["staff 3"] = ["staff 3A"];
    flow["staff 2A"] = ["UR"];
    flow["staff 3A"] = ["UR"];
    flow["UR"] = ["final"];

    let layers : string[][];

    onMount(() => {
        recompute();
        window.addEventListener('resize', recompute);
        //todo add event listener for particular button clicks
    });
    
    // Todo: Clean Up
        // How organize this 
    function recompute(): void {
        graphWidth = graph.getBoundingClientRect().width;
		graphHeight = graph.getBoundingClientRect().height;

        center = { x : graphWidth / 2, y : graphHeight / 2};
        lineStart = margin.left;
        lineEnd = graphWidth - margin.right;
        xSpacing = (lineEnd - lineStart) / (linearStageCount - 1);

        //todo for progress view, include data about progress per point (color and stuff?)
        points = [];

        resetLayers();

        readFlow("initial", 0);

        // addPoint(lineStart, center.y);

        createPoints();

        // readFlow();

        // addPoint(lineEnd, center.y);

        // let x1 = lineStart;
        // let x2 = lineStart + xSpacing;
        // for(let i = 2; i <= linearStageCount + 1; i++) {
        //     let point : Point = { x : x1, y : center.y, pos : 0};
        //     points.push(point);

        //     x1 = x2;
        //     x2 = lineStart + (i * xSpacing);
        // }
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
            console.log(pos + " " + layer.length);
            const x = lineStart + pos * xSpacing
            const y0 = center.y - (((layer.length - 1) / 2) * ySpacing); //trust me

            for(let i = 0; i < layer.length; i++) {
                const y = y0 + (i * ySpacing);
                addPoint(x, y);

            }
            
        }
    }

    function addPoint(x : number, y : number) {
        const point : Point = { x : x, y : y};
            points.push(point);
    }

</script>

<div class="flex justify-center border-blue border-4">
    <div class="border-2 border-black justify-center w-[100%] max-w-[800px] h-[500px]">
        <svg id="graph" viewBox="0 0 {graphWidth} {graphHeight}" width=100% bind:this={graph}>
            <g>
                <!-- {#each points as point, index}
                    {#if index < points.length - 1}
                        <NodeLine x1={point.x} y1={point.y} x2={points[index + 1].x} y2={points[index + 1].y}></NodeLine>
                    {/if}
                {/each} -->
            </g>
            
            <g>
                {#each points as point, index}
                    <!-- todo do something special with the start and end -->
                    {#if index == 0 || index == points.length - 1}
                        <NodeButton cx={point.x} cy={point.y} r={radius} editable={false}></NodeButton>
                    {:else}
                        <NodeButton cx={point.x} cy={point.y} r={radius}></NodeButton>
                    {/if}
                {/each}
            </g>
        </svg>
    </div>  
</div>