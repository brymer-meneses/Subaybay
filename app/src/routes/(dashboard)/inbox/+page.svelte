<script lang="ts">
  import File from "lucide-svelte/icons/file";
  import ListFilter from "lucide-svelte/icons/list-filter";

  import { Button } from "$lib/components/ui/button/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import * as Tabs from "$lib/components/ui/tabs/index.js";
  import Inbox from "./Inbox.svelte";
  import InboxContent from "./InboxContent.svelte";
  import NewRequest from "./NewRequest.svelte";
  import type { PageServerData } from "./$types";
  import type { InboxStageData } from "./inboxTypes";

  import { notifications } from "$lib/notifications";
  import Notifiable from "../Notifiable.svelte";

  export let data: PageServerData;

  let latestReqTypes = data.latestRequestTypes;

  let selectedStage: InboxStageData | null = null;
  let inboxes: { active: any; pending: any } = {
    active: [],
    pending: [],
  };

  let currentStageType: "active" | "pending" = "active";

  if (inboxes[currentStageType].length > 0) {
    selectedStage = inboxes[currentStageType];
  }

  function selectStage(stage: any) {
    selectedStage = stage;
  }

  function onTabChange(value: string | undefined) {
    if (value == "active" || value == "pending") {
      currentStageType = value;
      updateSelectedStage();
    }
  }

  function updateSelectedStage() {
    selectedStage = inboxes[currentStageType].getUpdatedSelection();
  }

  $: totalPending = $notifications.inbox.pending.reduce((accumulator, item) => {
    const [_, count] = item;
    return accumulator + count;
  }, 0);

  $: totalActive = $notifications.inbox.active.reduce((accumulator, item) => {
    const [_, count] = item;
    return accumulator + count;
  }, 0);
</script>

<main
  class="grid flex-1 items-start gap-4 p-4 sm:py-0 sm:pl-9 md:gap-8 md:pl-2 md:pr-4 lg:grid-cols-1 xl:grid-cols-4 xl:px-6"
>
  <div class="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
    <Tabs.Root value="active" onValueChange={onTabChange}>
      <div class="flex items-center">
        <Tabs.List>
          <Tabs.Trigger value="active">
            <Notifiable count={totalActive}>Active</Notifiable>
          </Tabs.Trigger>
          <Tabs.Trigger value="pending">
            <Notifiable count={totalPending}>Pending</Notifiable>
          </Tabs.Trigger>
        </Tabs.List>
        <div class="ml-auto flex items-center gap-2">
          <NewRequest {latestReqTypes} data={data.form} />
        </div>
      </div>
      <Tabs.Content value="active">
        <Inbox
          bind:this={inboxes.active}
          stages={data.activeStages}
          onSelectStage={selectStage}
          isShown={currentStageType === "active"}
        />
      </Tabs.Content>
      <Tabs.Content value="pending">
        <Inbox
          bind:this={inboxes.pending}
          stages={data.pendingStages}
          onSelectStage={selectStage}
          isShown={currentStageType === "pending"}
        />
      </Tabs.Content>
    </Tabs.Root>
  </div>

  <div class="lg:col-span-2">
    <InboxContent
      {updateSelectedStage}
      bind:stage={selectedStage}
      requests={data.relevantRequests}
      users={data.users}
    />
  </div>
</main>
