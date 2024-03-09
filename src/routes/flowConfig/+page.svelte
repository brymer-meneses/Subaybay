<script lang="ts">
    import NodeButton from '$lib/components/requestFlow/nodeButton.svelte';
    import NodeLine from '$lib/components/requestFlow/nodeLine.svelte';
    import {onMount} from 'svelte';
    import * as d3 from 'd3';

    type Point = {
        x : number;
        y : number;
    }
  
    let graph : any;

    let graphWidth : number;
	let graphHeight : number;

    let linearStageCount : number = 5; // ignores parallel stages
    let points : Point[] = []

	const margin = {
		top: 20,
		right: 30,
		bottom: 30,
		left: 30
	};
    const radius = 20;
  
    onMount(() => {
        redraw();
        window.addEventListener('resize', redraw);
        //todo add event listener for particular button clicks
    });
    
    // Todo: Clean Up
        // How organize this 
    function redraw(): void {
        d3.select(graph);

        graphWidth = d3.select(graph).node().getBoundingClientRect().width;
		graphHeight = d3.select(graph).node().getBoundingClientRect().height;
        let g = d3.select(graph).append('g');

        // pick best place to compute this stuff
        const center = { x : graphWidth / 2, y : graphHeight / 2};

        const lineStart = margin.left;
        const lineEnd = graphWidth - margin.right;
        const xSpacing = (lineEnd - lineStart) / (linearStageCount - 1);

        //todo for progress view, include data about progress per point (color and stuff?)
        points = [];

        // Create points to be created later on
        // Starting from second point
        let x1 = lineStart;
        let x2 = lineStart + xSpacing;
        for(let i = 2; i <= linearStageCount + 1; i++) {
            let point : Point = { x : x1, y : center.y};
            points.push(point);

            x1 = x2;
            x2 = lineStart + (i * xSpacing);
        }
    }
    
</script>

<div class="flex justify-center border-blue border-4">
    <div class="border-2 border-black justify-center w-[100%] max-w-[800px]">
        <svg id="graph" viewBox="0 0 {graphWidth} {graphHeight}" width=100% bind:this={graph}>
            <g>
                {#each points as point, index}
                    {#if index < points.length - 1}
                        <NodeLine x1={point.x} y1={point.y} x2={points[index + 1].x} y2={points[index + 1].y}></NodeLine>
                    {/if}
                {/each}
            </g>
            
            {#each points as point, index}
                <!-- todo do something special with the start and end -->
                {#if index == 0 || index == points.length - 1}
                    <NodeButton cx={point.x} cy={point.y} r={radius} editable={false}></NodeButton>
                {:else}
                    <NodeButton cx={point.x} cy={point.y} r={radius}></NodeButton>
                {/if}
            {/each}
        </svg>
    </div>  
</div>