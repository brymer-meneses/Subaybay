<script lang="ts">
  import type { PageServerData } from "../$types";

  export let data: NonNullable<PageServerData>;
</script>

<h1>Hello there {data.name}</h1>
