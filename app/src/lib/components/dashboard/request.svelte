<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";

  export let name: string;
  export let selected: boolean = false;

  $: color = selected ? "bg-primary" : "bg-white";
</script>

<Card.Root class={`${color} cursor-pointer hover:bg-primary shadow-none`}>
  <Card.Header>
    <Card.Title>{name}</Card.Title>
    <Card.Description>Request Description</Card.Description>
  </Card.Header>
</Card.Root>
