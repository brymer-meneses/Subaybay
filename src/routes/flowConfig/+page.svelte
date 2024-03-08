<script lang="ts">
    import {onMount} from 'svelte';
    import * as d3 from 'd3';
  
    let graph : any;

    let graphWidth : number;
	let graphHeight : number;

    let linearStageCount : number = 5; // ignores parallel stages

	const margin = {
		top: 20,
		right: 20,
		bottom: 30,
		left: 30
	};
    const radius = 20;
  
    onMount(() => {
        redraw();
        window.addEventListener('resize', redraw);
        //todo add event listener for particular button clicks
    });
    
    // Todo: Clean
    function redraw(): void {
        d3.select(graph).html(null);

        graphWidth = d3.select(graph).node().getBoundingClientRect().width;
		graphHeight = d3.select(graph).node().getBoundingClientRect().height;

        console.log(graphWidth + " " + graphHeight);
        
        // pick best place to compute this stuff
        const center = { x : graphWidth / 2, y : graphHeight / 2};
        const width = graphWidth - margin.left - margin.right;
        const height = graphHeight - margin.top - margin.bottom;

        const lineStart = margin.left;
        const lineEnd = graphWidth - margin.right;
        const xSpacing = (lineEnd - lineStart) / (linearStageCount - 1);

        let g = d3.select(graph)
            .append('g')

        // Todo: Make into buttons
            // edit for created nodes (+ popup that allows deletions)
            // + for new nodes

        // Draw
        let x1 = lineStart;
        let x2 = lineStart + xSpacing;
        for(let i = 1; i <= linearStageCount; i++)
        {
            g.append('circle')
            .attr('cx', x1)
            .attr('cy', center.y)
            .attr('r', radius)
            .attr('fill', 'gray');
            
            g.append('line')
            .attr('x1', x1).attr('y1', center.y)
            .attr('x2', x2).attr('y2', center.y)
            .attr('stroke', "blue")
            .attr('stroke-width', 2)

            x1 = x2;
            x2 = lineStart + (i * xSpacing);
        }
        
        //?? Should first and last be specially rendered ?
        // First and last should actually be untouchable, 
        // since first is always initial (encode) and last is always Finish

        // Draw End
        g.append('circle')
            .attr('cx', lineEnd - radius)
            .attr('cy', center.y)
            .attr('r', radius)
            .attr('fill', 'gray')
    }
    
</script>

<div class="flex justify-center border-blue border-4">
    <div class="border-2 border-black justify-center w-[100%] max-w-[800px]">
        <svg id="graph" viewBox="0 0 {graphWidth} {graphHeight}" width=100% bind:this={graph}></svg>
    </div>  
</div>