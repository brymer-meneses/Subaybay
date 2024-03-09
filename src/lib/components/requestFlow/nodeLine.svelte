<script lang='ts'>
    import { onMount } from "svelte";

	export let x1 : number = 0, y1 : number = 100;
	export let x2 : number = 500, y2 : number = 100;
    $: slope = (y2 - y1) / (x2 - x1);
    // todo export a callback?    

    let line : any;
    let addButton : any;
    
    let hovered : boolean = false;
    let hoveredX : number;
    let hoveredY : number;
	
	let color = 'black';
    let thickness = 3;

    onMount(() => {
        window.addEventListener('mousemove', handleMouseMove);
    });

    function handleMouseMove(e: any) {
        if(!hovered) return;

        hoveredX = e.clientX - line.getBoundingClientRect().left + x1;
        hoveredY = slope * (hoveredX - x1) + y1;
    }
	
	function handleMouseOver(e : any) {
        hovered = true;

		color = 'green';
        thickness = 6;
	}

	function handleMouseOut(e : any) {
        hovered = false;
        color = 'black';
        thickness = 3;
	}    
</script>

<g>
    <!-- Hitbox -->
    <!-- svelte-ignore a11y-mouse-events-have-key-events svelte-ignore a11y-click-events-have-key-events svelte-ignore a11y-no-static-element-interactions svelte-ignore a11y-mouse-events-have-key-events -->
    <line x1={x1} y1={y1} x2={x2} y2={y2} 
        stroke=transparent stroke-width={40}
        on:mouseover={handleMouseOver} on:mouseout={handleMouseOut}/>

    <line bind:this={line} x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={color} stroke-width={thickness} 
        style="pointer-events: none;"/>
    
    {#if hovered}
        <circle bind:this={addButton} r={10} cx={hoveredX} cy={hoveredY} style="pointer-events: none;"></circle>
        <!-- on click add new node -->
    {/if}
</g>