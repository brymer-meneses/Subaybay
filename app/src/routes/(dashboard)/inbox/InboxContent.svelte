<script lang="ts">
  import { goto } from "$app/navigation";
  import { enhance } from "$app/forms";

  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Badge } from "$lib/components/ui/badge";
  import type { Request, InboxStageData } from "$lib/server/database";
  import { Textarea } from "$lib/components/ui/textarea";

  import MoveLeft from "lucide-svelte/icons/move-left";
  import User from "lucide-svelte/icons/user";

  import * as Tabs from "$lib/components/ui/tabs";

  import ChatArea from "../ChatArea.svelte";
  import FinishButton from "./FinishButton.svelte";

  export let requests: { [key: string]: any };
  export let selectedStage: any;
  export let users: any;
  let nextHandlerId: string;

  export let updateSelectedStage: () => void;

  let processing = false;
  //todo change display when processing is true

  $: info = selectedStage ? requests[selectedStage.requestId] : null;
</script>

{#if info}
  <Card.Root class="overflow-hidden">
    <Card.Header class="flex flex-row items-start bg-muted/50">
      <div class="grid gap-0.5">
        <Card.Title class="group flex items-center gap-2 text-lg">
          {selectedStage.stageTitle}
        </Card.Title>
        <Card.Description>
          {selectedStage.requestId} <br />
          Currently at Step: {selectedStage.currentStageTypeIndex} <br />
          {#if selectedStage.prevHandlerId in users}
            From: {users[selectedStage.prevHandlerId].name} <br />
          {/if}
          {#if selectedStage.currentStageTypeIndex != selectedStage.inboxStageTypeIndex}
            You handled Step: {selectedStage.inboxStageTypeIndex}
          {/if}
        </Card.Description>
      </div>

      <div class="ml-auto flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          class="h-8 gap-1"
          on:click={() => {
            goto("/requests/" + selectedStage.requestId);
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

      {#if !processing}
        <div class="flex gap-2">
          <!-- todo add special button for fully finalizing stage-->
          {#if selectedStage.currentStageTypeIndex == selectedStage.inboxStageTypeIndex}
            <FinishButton
              {selectedStage}
              {users}
              {processing}
              bind:nextHandlerId
            >
              <form
                action="?/finish_stage"
                method="POST"
                use:enhance={() => {
                  processing = true;

                  return async ({ update }) => {
                    await update();
                    processing = false;
                    updateSelectedStage();
                  };
                }}
              >
                <input
                  type="hidden"
                  name="requestId"
                  value={selectedStage.requestId}
                />
                <input
                  type="hidden"
                  name="nextHandlerId"
                  value={nextHandlerId}
                />
                <Button
                  type="submit"
                  disabled={nextHandlerId in users ? false : true}
                  >Confirm</Button
                >
              </form>
            </FinishButton>
          {:else}
            <form
              action="?/rollback_stage"
              method="POST"
              use:enhance={() => {
                processing = true;

                return async ({ update }) => {
                  await update();
                  processing = false;
                  updateSelectedStage();
                };
              }}
            >
              <input
                type="hidden"
                name="requestId"
                value={selectedStage.requestId}
              />
              <input
                type="hidden"
                name="inboxStageTypeIndex"
                value={selectedStage.inboxStageTypeIndex}
              />
              <!--todo add confirmation-->
              <Button
                type="submit"
                class="gap-2 rounded-md"
                variant="destructive"
              >
                <MoveLeft />
                Rollback
              </Button>
            </form>
          {/if}
        </div>
      {:else}
        Processing... Please Wait...
      {/if}
    </Card.Content>
  </Card.Root>
{/if}
