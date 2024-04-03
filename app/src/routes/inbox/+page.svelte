<script lang="ts">
  import StageItem from "./StageItem.svelte";
  import ScrollArea from "$lib/components/general/ScrollArea.svelte";
  import type { PageServerData } from "./$types";
  import ChatArea from "$lib/components/general/ChatArea/ChatArea.svelte";

  import Profile from "$lib/components/general/Profile.svelte";
  import { BxSearch, BxsSend } from "svelte-boxicons";
  import { CheckCheck, MoveLeft, User, Send } from "lucide-svelte";

  import { Progress } from "$lib/components/ui/progress/index.js";
  import Button from "$lib/components/ui/button/button.svelte";

  export let data: PageServerData;
</script>

<!-- inbox content -->
<section class="flex flex-col items-center gap-8 basis-2/5 p-5 bg-pale-red-100">
  <Profile name={data.userInfo.name} profileUrl={data.userInfo.imageUrl} />

  <!-- search -->
  <div
    class="w-[95%] h-[50px] bg-pale-red-300 rounded-xl flex flex-row items-center justify-start p-3 gap-3"
  >
    <BxSearch size="20" class="fill-pale-red-500" />
    <p class="text-pale-red-500">Search</p>
  </div>

  <!-- inbox items -->
  <ScrollArea>
    <div class="flex flex-col gap-2">
      <StageItem
        isSelected={true}
        stageTitle="HD and GMC forwarded to UR for signature"
        requestTitle="Honorable Dismissal"
        dateSent={new Date().toDateString()}
        requestId={1}
      />
      {#each Array(100) as _, index (index)}
        <StageItem
          isSelected={false}
          stageTitle="HD and GMC forwarded to UR for signature"
          requestTitle="Honorable Dismissal"
          dateSent={new Date().toDateString()}
          requestId={1}
        />
      {/each}
    </div>
  </ScrollArea>
</section>

<!-- stage content -->
<section class="h-full basis-2/5 p-5 bg-pale-red-200 flex flex-col gap-10">
  <!-- previous stage metadata -->
  <div class="w-full flex flex-row justify-start items-center">
    By
    <div
      class="flex justify-center items-center gap-3 bg-pale-red-100 w-fit rounded-2xl p-2 px-4 ml-4"
    >
      <img
        src={data.userInfo.imageUrl}
        alt="profile"
        class="object-cover w-8 h-8 rounded-full"
      />
      <div class="flex flex-col">
        <p class="text-base text-black">{data.userInfo.name}</p>
        <p class="text-sm font-light">March 25, 2024 7:32 AM</p>
      </div>
    </div>
  </div>

  <div class="flex-col flex gap-2">
    <h1 class="text-4xl font-extrabold text-primary drop-shadow-sm">
      HD and GMC forwarded to UR for signature
    </h1>
    <h2 class="text-xl font-light flex-row flex gap-2">
      <p class="font-light">Honorable Dismissal</p>
      <p class="font-extralight">#00001</p>
    </h2>

    <ul class="bg-white rounded-md p-2 font-light">
      <li>John Doe</li>
      <li>2021-00143</li>
      <li>jdoe@up.edu.ph</li>
    </ul>
  </div>

  <div class="h-1/3 flex flex-col gap-4">
    <ChatArea
      email={data.userInfo.email}
      senderProfileUrl={data.userInfo.imageUrl}
      roomId="abcd"
    />
  </div>
  <Progress value={2} max={10} class="w-full h-5" />

  <!-- buttons -->
  <div class="flex gap-2">
    <Button class="rounded-xl text-white gap-2">
      <CheckCheck />
      Finish
    </Button>
    <Button class="rounded-xl text-white gap-2">
      <MoveLeft />
      Rollback
    </Button>
    <Button class="rounded-xl text-white gap-2">
      <User />
      Reassign
    </Button>
  </div>
</section>
