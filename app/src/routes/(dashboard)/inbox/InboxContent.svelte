<script lang="ts">
  import { goto } from "$app/navigation";

  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Badge } from "$lib/components/ui/badge";
  import type { Request } from "$lib/server/database";
  import { Textarea } from "$lib/components/ui/textarea";
  import * as Tabs from "$lib/components/ui/tabs";

  import type { InboxStageData, UserInfo } from "./inboxTypes";
  import ChatArea from "../ChatArea.svelte";
  import InboxContentButtons from "./InboxContentButtons.svelte";

  export let requests: { [key: string]: Request};
  export let stage: InboxStageData | null;
  export let users: { [key: string]: UserInfo};

  export let updateSelectedStage: () => void;

  let processing = false;
  //todo change display when processing is true

  $: info = stage ? requests[stage.requestId] : null;
</script>

{#if stage && info}
  <Card.Root class="overflow-hidden">
    <Card.Header class="bg-muted/50 flex flex-row items-start">
      <div class="grid gap-0.5">
        <Card.Title class="group flex items-center gap-2 text-lg">
          {stage.stageTitle}
        </Card.Title>
        <Card.Description>
          {stage.requestId} <br />
          Currently at Step: {stage.currentStageTypeIndex} <br />
          {#if stage.prevHandlerId in users}
            From: {users[stage.prevHandlerId].name} <br />
          {/if}
          {#if stage.currentStageTypeIndex != stage.inboxStageTypeIndex}
            You handled Step: {stage.inboxStageTypeIndex}
          {/if}
        </Card.Description>
      </div>

      <div class="ml-auto flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          class="h-8 gap-1"
          on:click={() => {
            goto("/requests/" + stage.requestId);
          }}
        >
          <span class="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
            View Progress
          </span>
        </Button>
      </div>
    </Card.Header>
    <Card.Content class="flex flex-col gap-4 p-6 text-sm">
      <Tabs.Root value="details">
        <Tabs.List>
          <Tabs.Trigger value="details">Details</Tabs.Trigger>
          <Tabs.Trigger value="chat">Chat</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="details">
          <Card.Root>
            <Card.Content class="p-4">
              <div class="flex flex-col gap-4">
                <p class="text-xs font-semibold">Student Information</p>
                <div class="flex flex-wrap gap-4">
                  <Badge variant="secondary" class="font-normal"
                    >{info.studentNumber}</Badge
                  >
                  <Badge variant="secondary" class="font-normal"
                    >{info.studentName}</Badge
                  >
                  <Badge variant="secondary" class="font-normal"
                    >{info.studentEmail}</Badge
                  >
                </div>
                <p class="text-xs font-semibold">Purpose</p>
                <Textarea disabled value={info.purpose} />
                <p class="text-xs font-semibold">Remarks</p>
                <Textarea disabled value={info.remarks} />
              </div>
            </Card.Content>
          </Card.Root>
        </Tabs.Content>

        <Tabs.Content value="chat">
          <ChatArea roomId="abcd" />
        </Tabs.Content>
      </Tabs.Root>

      <InboxContentButtons stage={stage} {users} {updateSelectedStage} bind:processing={processing}/>
      
    </Card.Content>
  </Card.Root>
{/if}
