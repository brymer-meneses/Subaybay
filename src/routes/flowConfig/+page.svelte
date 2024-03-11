<script lang="ts">
    import NodeGraph from '$lib/components/requestFlow/nodeGraph.svelte';
    
    let nodeGraph : any;
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

        nodeGraph.recompute();
    }

    function generateRandomStageName(base : string) : string {
        let n = 1;
        while(base + n in flow) {
            n++;
        }
        return base + n;
    }
    // todo generate sql query
</script>

<div class="flex justify-center border-blue border-4 h-[600px]">
    <NodeGraph bind:this={nodeGraph}
        flow = {flow}
        onLineClick = {createNewStage}
        lineHoverText = "Add New Node"
    ></NodeGraph>
</div>

