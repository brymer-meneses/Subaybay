<script lang='ts'>
	export let cx : number = 0;
	export let cy : number = 0;
	export let r : number = 40;
	export let text : string = "";

    const color = 'red';
		
	function handleMouseOver(e : any) {
	}
	function handleMouseOut(e : any) {
	}
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events svelte-ignore svelte-ignore a11y-no-static-element-interactions svelte-ignore a11y-mouse-events-have-key-events -->
<g>
	<circle cx={cx} cy={cy} r={r} fill={color}
		on:mouseover={handleMouseOver} on:mouseout={handleMouseOut}
    />
	<text x={cx} y={cy + r} text-anchor=middle dominant-baseline=hanging style="pointer-events: none;"> 
		{text}
	</text>
</g>
