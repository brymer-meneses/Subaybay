<script lang="ts">
  import * as Tabs from "$lib/components/ui/tabs/index.js";
  import Inbox from "./Inbox.svelte";
  import InboxContent from "./InboxContent.svelte";
  import NewRequest from "./NewRequest.svelte";
  import type { PageServerData } from "./$types";
  import type { MultiStageData } from "./inboxTypes";

  import { notifications } from "$lib/notifications";
  import Notifiable from "../Notifiable.svelte";

  export let data: PageServerData;

  let latestReqTypes = data.latestRequestTypes ?? [];

  let selected: MultiStageData | null = null;
  let inboxes: { active: Inbox | null; pending: Inbox | null } = {
    active: null,
    pending: null,
  };

  let currentStageType: "active" | "pending" = "active";

  function selectStage(multiStage: MultiStageData) {
    selected = multiStage;
  }

  function onTabChange(value: string | undefined) {
    if (value == "active" || value == "pending") {
      currentStageType = value;
      updateSelectedStage();
    }
  }

  function updateSelectedStage() {
    selected = inboxes[currentStageType]?.getUpdatedSelection() ?? null;
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

<main class="flex flex-col justify-between gap-8 px-8 xl:h-[85vh] xl:flex-row">
  <div class="h-full flex-grow xl:w-[50%]">
    <Tabs.Root
      value="active"
      onValueChange={onTabChange}
      class="flex h-full flex-grow flex-col"
    >
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
      <Tabs.Content value="active" class="grow overflow-hidden">
        <div class="flex h-full overflow-hidden">
          <Inbox
            bind:this={inboxes.active}
            stages={data.activeStages}
            onSelectStage={selectStage}
            type="active"
            isShown={currentStageType === "active"}
          />
        </div>
      </Tabs.Content>
      <Tabs.Content value="pending" class="grow overflow-hidden">
        <div class="flex h-full overflow-hidden">
          <Inbox
            bind:this={inboxes.pending}
            stages={data.pendingStages}
            onSelectStage={selectStage}
            type="pending"
            isShown={currentStageType === "pending"}
          />
        </div>
      </Tabs.Content>
    </Tabs.Root>
  </div>

  <div class="h-full flex-grow xl:w-[50%]">
    <InboxContent
      {updateSelectedStage}
      bind:multiStage={selected}
      requests={data.relevantRequests ?? {}}
      users={data.users ?? {}}
    />
  </div>
</main>
