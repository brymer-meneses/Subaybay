<script lang="ts">
    import NodeButton from '$lib/components/requestFlow/nodeButton.svelte';
    import NodeLine from '$lib/components/requestFlow/clickableNodeLine.svelte';
    import {onMount} from 'svelte';

    type Point = {
        x : number;
        y : number;
    }
  
    let graph : any;

    let graphWidth : number;
	let graphHeight : number;

	const margin = {
		top: 20,
		right: 30,
		bottom: 30,
		left: 30
	};
    const radius = 20;
    const yStart = margin.top + radius;
    const ySpacing = 100;

    // this stores the connection between stages
    // Note: this assumes that a stage cannot be repeated twice, 
        // make sure to add code to account for this when adding new stages
        // todo: add Blank stage to help with formatting

    const flow: { [key: string]: string[]} = {};
    flow["initial"] = ["a1", "b1", "c1"];
    flow["a1"] = ["a2"];
    flow["b1"] = ["b2"];
    flow["b2"] = ["d"];
    flow["a2"] = ["d"];
    flow["c1"] = ["c2"];
    flow["c2"] = ["d"];
    flow["d"] = ["final"];

    // todo: look into reducing the amount of data structures here
    // this links a stage to its point
    let stageToPoint : {[key: string]: Point} = {};

    // this stores the structure to print
    let layers : string[][];

    onMount(() => {
        recompute();
        window.addEventListener('resize', recompute);
    });
    
    // Todo: Clean Up
        // How organize this 
    function recompute(): void {
        graphWidth = graph.getBoundingClientRect().width;
		graphHeight = graph.getBoundingClientRect().height;

        stageToPoint = {};

        layers = [];

        readFlow();

        let lineStart = margin.left;
        let lineEnd = graphWidth - margin.right;
        let center = { x : graphWidth / 2, y : graphHeight / 2};
        let xSpacing = (lineEnd - lineStart) / (layers.length - 1);

        createPoints(lineStart, center, xSpacing);
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
            
            console.log("Current: " + current.stage);
            addToLayer(current.stage, current.pos, current.height);

            const nextStages = flow[current.stage];
            if(!nextStages) continue; //?this only addresses "final" I think? 
           
            let h = current.height;
            for(const stage of nextStages) {
                console.log("Queuing: " + stage);
                queue.push({stage : stage, pos : current.pos + 1, height : h});
                h++;
            }
        }
    }

    //todo fix nesting, ew, extract the functions
    function addToLayer(element : string, index : number, height : number) {       
        ensureLayersSize(index);
        ensureLayerHeight(layers[index], height);

        let exists = false;
        let found = false;
        
        // remove the element if it was already placed in a previous layer
        for(let i = 0; i < index; i++) {
            const elementIndex = layers[i].indexOf(element);
            if(elementIndex != -1) {
                console.log("Removing " + element); 
                exists = false;
                layers[i][elementIndex] = '';
                break;
            }
        }      

        if(!found) {
            // If element already in this layer, try to minimize its height
            const elementIndex = layers[index].indexOf(element);
            if(elementIndex != -1) {
                if(elementIndex > height) {
                    layers[index][elementIndex] = '';
                    layers[index][height] = element;
                }
                exists = true;
            }
        }
        
        if(!found) {
            // If element in future layer, don't add it
            for(let i = index; i < layers.length; i++) {
                const elementIndex = layers[i].indexOf(element);
                if(elementIndex != -1) {
                    exists = true;
                    console.log("Not re-adding" + element); 
                    break;
                }
            }
        }
        
        
        if(!exists) {
            console.log("Adding " + element); 
            layers[index][height] = element;
        }
    }

    function ensureLayersSize(requiredIndex : number) {
        const maxIndex = layers.length - 1;
        if(maxIndex >= requiredIndex) return;

        for(let i = maxIndex; i < requiredIndex; i++) {
            layers.push([]);
        }
    }

    function ensureLayerHeight(layer : string[], requiredIndex : number) {
        const maxIndex = layer.length - 1;
        if(maxIndex >= requiredIndex) return;

        for(let i = maxIndex; i < requiredIndex; i++) {
            layer.push('');
        }
    }

    function createPoints(lineStart : number, center : Point, xSpacing : number) {
        //todo find a way to ensure order is preserved
        for(let pos = 0; pos < layers.length; pos++) {
            let layer = layers[pos];
            console.log("Layer length: " + layer.length);

            const x = lineStart + pos * xSpacing

            for(let i = 0; i < layer.length; i++) {
                const y = yStart + (i * ySpacing);
                if(layer[i]) addPoint(x, y, layer[i]);
            }
            
            //todo do something with first pos = 0 and last pos = layers.Count - 1
        }
    }

    function addPoint(x : number, y : number, stage : string) {
        const point : Point = { x : x, y : y};
        stageToPoint[stage] = point;
    }

    function createNewStage(from : string, to : string) {
        const isLinearAddition = flow[from].indexOf(to) != -1;

        let newStage = generateRandomStageName("New Stage ");
        
        if(isLinearAddition) {
            const i = flow[from].indexOf(to);
            flow[from][i] = newStage;
            flow[newStage] = [to];
            console.log("Is Linear");
        }
        else {
            console.log("Is Parallel")
        }

        console.log(from + " - " + to);

        recompute();
    }

    function generateRandomStageName(base : string) : string {
        let n = 1;
        while(base + n in flow) {
            n++;
        }
        return base + n;
    }

</script>

<div class="flex justify-center border-blue border-4 h-[600px]">
    <div bind:this={graph} class="border-2 border-black justify-center w-[100%] max-w-[800px] h-[100%]">
        <svg viewBox="0 0 {graphWidth} {graphHeight}" width=100%>
            <g>
                {#if Object.keys(stageToPoint).length > 0} 
                    {#each Object.keys(flow) as start}
                        {#each flow[start] as end}
                            <NodeLine 
                                x1={stageToPoint[start].x} 
                                y1={stageToPoint[start].y} 
                                x2={stageToPoint[end].x} 
                                y2={stageToPoint[end].y}
                                onClick = {() => createNewStage(start, end)}
                            ></NodeLine>
                        {/each}
                    {/each}
                {/if}
            </g>
            
            <g>
                {#if Object.keys(stageToPoint).length > 0}
                    {#each Object.entries(stageToPoint) as [stage, point]}
                        <NodeButton cx={point.x} cy={point.y} r={radius} text={stage}></NodeButton>
                    {/each}
                {/if}
            </g>
        </svg>
    </div>  
</div>