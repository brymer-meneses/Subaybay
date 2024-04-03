<script lang="ts">
  import StageItem from "./StageItem.svelte";
  import ScrollArea from "$lib/components/general/ScrollArea.svelte";
  import StageContent from "./StageContent.svelte";
  import type { PageServerData } from "./$types";

  import Profile from "$lib/components/general/Profile.svelte";
  import { BxSearch } from "svelte-boxicons";

  export let data: PageServerData;
</script>

<section class="flex flex-col items-center gap-8 basis-2/5 p-5 bg-pale-red-100">
  <Profile name={data.userInfo.name} profileUrl={data.userInfo.imageUrl} />
  <div
    class="w-[95%] h-[50px] bg-pale-red-300 rounded-xl flex flex-row items-center justify-start p-3 gap-3"
  >
    <BxSearch size="20" class="fill-pale-red-500" />
    <p class="text-pale-red-500">Search</p>
  </div>
  <ScrollArea>
    <div class="flex flex-col gap-2">
      {#each Array(100) as _, index (index)}
        <StageItem
          stageTitle="HD and GMC forwarded to UR for signature"
          requestTitle="Honorable Dismissal"
          dateSent={new Date().toDateString()}
          requestId={1}
        />
      {/each}
    </div>
  </ScrollArea>
</section>

<section class="basis-2/5 p-10 bg-pale-red-200">
  <StageContent />
</section>
