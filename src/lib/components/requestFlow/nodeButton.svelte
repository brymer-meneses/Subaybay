<script lang='ts'>
	export let cx : number = 0;
	export let cy : number = 0;
	export let r : number = 40;
	export let text : string = "";
	export let hoverText : string = "hover";
    export let color = 'gray';
	export let onClick : () => void = () => {};

    let isHovered : boolean = false;
		
	function handleMouseOver(e : any) {
		isHovered = true;
		//show icon that allows editing
		color = 'green';
	}
	function handleMouseOut(e : any) {
		isHovered = false;

		color = 'gray';
	}
	function handleClick() {
		onClick();
	}
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events svelte-ignore a11y-click-events-have-key-events svelte-ignore a11y-no-static-element-interactions svelte-ignore a11y-mouse-events-have-key-events -->
<g>
	<circle cx={cx} cy={cy} r={r} fill={color}
		on:mouseover={handleMouseOver} on:mouseout={handleMouseOut}
		on:click={handleClick}/>
	{#if isHovered}
		<text x={cx} y={cy - r} text-anchor=middle dominant-baseline=text-after-edge style="pointer-events: none;"> 
			{hoverText}
		</text>
    {/if}
	<text x={cx} y={cy + r} text-anchor=middle dominant-baseline=hanging style="pointer-events: none;"> 
		{text}
	</text>
</g>
