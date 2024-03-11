<script lang="ts">
    import NodeCircle from '$lib/components/requestFlow/nodeCircle.svelte';
    import {onMount} from 'svelte';

    type Point = {
        x : number;
        y : number;
    }

    const margin = {
		top: 20,
		right: 30,
		bottom: 30,
		left: 30
	};
    const radius = 20;
    const yStart = margin.top + radius;
    const ySpacing = 100;
  
    let graph : any;
    let graphWidth : number;
	let graphHeight : number;

    // todo read from database
    const flow: { [key: string]: string[]} = {};
    flow["initial"] = ["a1", "b1", "c1"];
    flow["a1"] = ["a2"];
    flow["b1"] = ["b2"];
    flow["b2"] = ["d"];
    flow["a2"] = ["d"];
    flow["c1"] = ["c2"];
    flow["c2"] = ["d"];
    flow["d"] = ["final"];

    let stageToPoint : {[key: string]: Point} = {};
    let structure : string[][];

    onMount(() => {
        recompute();
        window.addEventListener('resize', recompute);
    });
    
    function recompute(): void {
        graphWidth = graph.getBoundingClientRect().width;
		graphHeight = graph.getBoundingClientRect().height;

        stageToPoint = {};
        structure = [];

        readFlow();

        createPoints();
    }

    // Create Layers list
    // todo: see if a depth first search also works, it might be more space efficient
    function readFlow() {
        type Item = { stage : string; pos : number; height : number }
        let queue : Item[] = [];
        const initial = { stage : "initial", pos : 0, height : 0 };
        queue.push(initial);

        while(true) {
            const current = queue.shift();
            if(!current) return;
            
            addToLayer(current.stage, current.pos, current.height);

            const nextStages = flow[current.stage];
            if(!nextStages) continue;
           
            let h = current.height;
            for(const stage of nextStages) {
                queue.push({stage : stage, pos : current.pos + 1, height : h});
                h++;
            }
        }
    }

    //todo fix nesting, ew, extract the functions
    function addToLayer(element : string, index : number, height : number) {       
        ensureLayersSize(index);
        ensureLayerHeight(structure[index], height);

        let exists = false;
        let found = false;
        
        // remove the element if it was already placed in a previous layer
        for(let i = 0; i < index; i++) {
            const elementIndex = structure[i].indexOf(element);
            if(elementIndex != -1) {
                exists = false;
                structure[i][elementIndex] = '';
                break;
            }
        }      

        if(!found) {
            // If element already in this layer, try to minimize its height
            const elementIndex = structure[index].indexOf(element);
            if(elementIndex != -1) {
                if(elementIndex > height) {
                    structure[index][elementIndex] = '';
                    structure[index][height] = element;
                }
                exists = true;
            }
        }
        
        if(!found) {
            // If element in future layer, don't add it
            for(let i = index; i < structure.length; i++) {
                const elementIndex = structure[i].indexOf(element);
                if(elementIndex != -1) {
                    exists = true;
                    break;
                }
            }
        }
        
        
        if(!exists) {
            structure[index][height] = element;
        }
    }

    function ensureLayersSize(requiredIndex : number) {
        const maxIndex = structure.length - 1;
        if(maxIndex >= requiredIndex) return;

        for(let i = maxIndex; i < requiredIndex; i++) {
            structure.push([]);
        }
    }

    function ensureLayerHeight(layer : string[], requiredIndex : number) {
        const maxIndex = layer.length - 1;
        if(maxIndex >= requiredIndex) return;

        for(let i = maxIndex; i < requiredIndex; i++) {
            layer.push('');
        }
    }

    function createPoints() {
        let lineStart = margin.left;
        let lineEnd = graphWidth - margin.right;
        let xSpacing = (lineEnd - lineStart) / (structure.length - 1);

        for(let pos = 0; pos < structure.length; pos++) {
            let layer = structure[pos];

            const x = lineStart + pos * xSpacing

            for(let i = 0; i < layer.length; i++) {
                const y = yStart + (i * ySpacing);
                if(layer[i]) addPoint(x, y, layer[i]);
            }
        }
    }

    function addPoint(x : number, y : number, stage : string) {
        const point : Point = { x : x, y : y};
        stageToPoint[stage] = point;
    }
</script>

<div bind:this={graph} class="justify-center w-[100%] max-w-[800px] h-[100%]">
    <svg viewBox="0 0 {graphWidth} {graphHeight}" width=100%>
        <g>
            {#if Object.keys(stageToPoint).length > 0} 
                {#each Object.keys(flow) as start}
                    {#each flow[start] as end}
                        <!--Todo for clickable, replace this-->
                        <!--Todo Change color depending on progress-->
                        <line 
                            x1 = {stageToPoint[start].x}
                            y1 = {stageToPoint[start].y}
                            x2 = {stageToPoint[end].x}
                            y2 = {stageToPoint[end].y}
                            stroke = black
                            stroke-width = {5}
                        ></line>
                    {/each}
                {/each}
            {/if}
        </g>
        
        <g>
            {#if Object.keys(stageToPoint).length > 0}
                {#each Object.entries(stageToPoint) as [stage, point]}
                    <NodeCircle cx={point.x} cy={point.y} r={radius} text={stage}></NodeCircle>
                {/each}
            {/if}
        </g>
    </svg>
</div>  