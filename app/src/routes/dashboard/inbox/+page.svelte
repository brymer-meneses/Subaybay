<script lang="ts">
  import "@fontsource/poppins/600.css";
  import StageItem from "./StageItem.svelte";
  import ScrollArea from "$lib/components/general/ScrollArea.svelte";
  import Profile from "$lib/components/dashboard/Profile.svelte";
  import ChatArea from "$lib/components/dashboard/ChatArea/ChatArea.svelte";

  import { BxSearch } from "svelte-boxicons";
  import { CheckCheck, MoveLeft, User } from "lucide-svelte";

  import { Progress } from "$lib/components/ui/progress/index.js";
  import Button from "$lib/components/ui/button/button.svelte";

  import * as Resizable from "$lib/components/ui/resizable/index.js";
  import type { PageServerData } from "./$types";

  export let data: PageServerData;

  // const searchItems = data.search.map((item: object) => ({ ...item }));

  type item = {
    isSelected: boolean;
    stageTitle: string;
    requestTitle: string;
    dateSent: string;
    requestId: number;
  };

  //DUMMY DATA
  let searchItems: item[] = [];
  for (let i = 0; i < 100; i++) {
    searchItems.push({
      isSelected: false,
      stageTitle: "HD and GMC forwarded to UR for signature",
      requestTitle: "Honorable Dismissal",
      dateSent: new Date(
        Math.floor(Math.random() * 10000000000000),
      ).toDateString(),
      requestId: Math.floor(Math.random() * 10000),
    });
  }

  let searchTerm: string = "";
  // i wanted the selected StageItem to stay selected even when searching but it's not working yet
  let selectedId: number = -1;

  $: filteredItems = searchItems.filter((item: item) => {
    for (const key in item) {
      if (String(item[key]).toLowerCase().includes(searchTerm.toLowerCase())) {
        return item;
      }
    }
  });

  function handleSelectItem(item: item) {
    selectedId = item.requestId;
    filteredItems = filteredItems.map((i) => {
      if (item === i) {
        return { ...i, isSelected: true };
      } else {
        return { ...i, isSelected: false };
      }
    });
  }
</script>

<Resizable.PaneGroup direction="horizontal">
  <Resizable.Pane defaultSize={25} minSize={20}>
    <section
      class="flex flex-col items-center gap-8 p-5 bg-pale-red-100 h-screen"
    >
      <Profile
        name={data.user.userInfo.name}
        profileUrl={data.user.userInfo.profileUrl}
      />

      <!-- search -->
      <div
        class="w-[95%] h-[50px] bg-pale-red-300 rounded-xl flex flex-row items-center justify-start p-3 gap-3"
      >
        <BxSearch size="20" class="fill-pale-red-500" />
        <input
          type="search"
          class="flex-grow text-pale-red-499 px-0 bg-transparent border-none"
          placeholder="Search..."
          bind:value={searchTerm}
        />
      </div>

      <!-- inbox items -->
      <ScrollArea>
        {#if searchTerm !== ""}
          <p>
            Returned {filteredItems.length} result{filteredItems.length === 1
              ? "."
              : "s."}
          </p>
        {/if}
        <p></p>
        <div class="flex flex-col gap-2">
          {#each filteredItems as item}
            <StageItem
              isSelected={item.isSelected}
              stageTitle={item.stageTitle}
              requestTitle={item.requestTitle}
              dateSent={item.dateSent}
              requestId={item.requestId}
              on:click={() => handleSelectItem(item)}
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
        By
        <div
          class="flex justify-center items-center gap-3 bg-pale-red-100 w-fit rounded-2xl p-2 px-4 ml-4"
        >
          <img
            src={data.user.userInfo.profileUrl}
            alt="profile"
            class="object-cover w-8 h-8 rounded-full"
          />
          <div class="flex flex-col">
            <p class="text-base text-black">{data.user.userInfo.name}</p>
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

        <ul class="bg-white rounded-md p-2 font-light">
          <li>John Doe</li>
          <li>2021-00143</li>
          <li>jdoe@up.edu.ph</li>
        </ul>
      </div>

      <div class="h-1/3 flex flex-col gap-4">
        <ChatArea
          userId={data.user.userInfo.id}
          sessionId={data.user.sessionId}
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
