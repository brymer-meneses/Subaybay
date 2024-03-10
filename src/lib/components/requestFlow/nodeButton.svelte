<script lang='ts'>
	const textSpacing : number = 25;

	export let cx : number = 0;
	export let cy : number = 0;
	export let r : number = 40;
	export let text : string = "";
	export let editable : boolean = true;
	export let onClick : () => void = () => {};
	
	let color = editable ? 'red' : 'blue';
	
	function handleMouseOver(e : any) {
		if(!editable) return;
		//show icon that allows editing
		color = 'green';
	}
	function handleMouseOut(e : any) {
		if(!editable) return;

		color = 'red';
	}
	function handleClick() {
		onClick();
	}

	// on click, thingy thing
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events svelte-ignore a11y-click-events-have-key-events svelte-ignore a11y-no-static-element-interactions svelte-ignore a11y-mouse-events-have-key-events -->
<g>
	<circle cx={cx} cy={cy} r={r} fill={color}
		on:mouseover={handleMouseOver} on:mouseout={handleMouseOut}
		on:click={handleClick}/>
	<text x={cx} y={cy + r} text-anchor=middle dominant-baseline=hanging style="pointer-events: none;"> 
		{text}
	</text>
</g>
