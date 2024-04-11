<script lang="ts">
  import "@fontsource/poppins/600.css";
  import StageItem from "./StageItem.svelte";
  import ScrollArea from "$lib/components/general/ScrollArea.svelte";
  import Profile from "$lib/components/dashboard/Profile.svelte";
  import ChatArea from "$lib/components/dashboard/ChatArea/ChatArea.svelte";

  import { BxSearch } from "svelte-boxicons";
  import { CheckCheck, MoveLeft, User, Forward } from "lucide-svelte";

  import { Progress } from "$lib/components/ui/progress/index.js";
  import Button from "$lib/components/ui/button/button.svelte";

  import * as Resizable from "$lib/components/ui/resizable/index.js";
  import type { PageServerData } from "./$types";

  export let data: PageServerData;
</script>

<Resizable.PaneGroup direction="horizontal">
  <Resizable.Pane defaultSize={25} minSize={20}>
    <section
      class="flex flex-col items-center gap-8 p-5 bg-pale-red-100 h-screen"
    >
      <Profile
        name={data.userInfo.name}
        profileUrl={data.userInfo.profileUrl}
      />

      <!-- search -->
      <div
        class="w-[95%] h-[50px] bg-pale-red-300 rounded-xl flex flex-row items-center justify-start p-3 gap-3"
      >
        <BxSearch size="20" class="fill-pale-red-500" />
        <p class="text-pale-red-499">Search</p>
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
  </Resizable.Pane>

  <Resizable.Handle />

  <Resizable.Pane defaultSize={30} minSize={40}>
    <!-- stage content -->
    <section class="p-5 bg-pale-red-200 flex flex-col gap-10 h-screen">
      <!-- previous stage metadata -->
      <div class="w-full flex flex-row justify-start items-center">
        <div
          class="flex justify-center items-center gap-3 bg-pale-red-100 w-fit rounded-2xl p-2 px-4"
        >
          <Forward />
          <img
            src={data.userInfo.profileUrl}
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
        <h1
          class="text-4xl font-extrabold text-primary drop-shadow-sm font-poppins"
        >
          HD and GMC forwarded to UR for signature
        </h1>
        <h2 class="text-xl font-light flex-row flex gap-2">
          <p class="font-light">Honorable Dismissal</p>
          <p class="font-extralight">#00001</p>
        </h2>

        <ul
          class="rounded-md font-light flex flex-row gap-2 items-center font-inter text-sm"
        >
          <li class="rounded-md p-2 bg-white">John Doe</li>
          <li class="rounded-md p-2 bg-white">2021-00143</li>
          <li class="rounded-md p-2 bg-white">jdoe@up.edu.ph</li>
        </ul>
      </div>

      <div class="h-1/3 flex flex-col gap-4">
        <ChatArea
          userId={data.userInfo.id}
          sessionId={data.sessionId}
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
  </Resizable.Pane>
</Resizable.PaneGroup>
