<script lang='ts'>
	export let cx : number = 0;
	export let cy : number = 0;
	export let r : number = 40;
	export let editable : boolean = true;
	
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

	}

	// on click, thingy thing
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events svelte-ignore a11y-click-events-have-key-events svelte-ignore a11y-no-static-element-interactions svelte-ignore a11y-mouse-events-have-key-events -->
<circle cx={cx} cy={cy} r={r} fill={color}
	on:mouseover={handleMouseOver} on:mouseout={handleMouseOut}
	on:click={handleClick}/>
