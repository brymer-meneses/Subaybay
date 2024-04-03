<script lang="ts">
  import Profile from "$lib/components/general/Profile.svelte";
  import type { PageServerData } from "./$types";

  export let data: PageServerData;
</script>

<section class="flex flex-col items-center gap-8 basis-4/5 p-5 bg-pale-red-100">
  <Profile name={data.userInfo.name} profileUrl={data.userInfo.imageUrl} />
</section>
