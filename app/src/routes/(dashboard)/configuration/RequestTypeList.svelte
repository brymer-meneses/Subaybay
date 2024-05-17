<script lang="ts">
  import { goto } from "$app/navigation";
  import Button from "$lib/components/ui/button/button.svelte";
  import type { RequestType } from "$lib/server/database";
  export let requestTypes: RequestType[];
</script>

<!--Todo layout-->
{#each requestTypes as requestType}
  <Button
    variant="link"
    on:click={() => {
      goto(`./configuration/${requestType._id}`);
    }}
  >
    {requestType.title}
  </Button>
{/each}
