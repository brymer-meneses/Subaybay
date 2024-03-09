<script lang="ts">
  import { user } from "$lib/user";

  const name = $user!.displayName;
</script>

<h1>Hello there {name}</h1>
