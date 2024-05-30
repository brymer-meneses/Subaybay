<script lang="ts">
  import { goto } from "$app/navigation";

  import * as Tooltip from "$lib/components/ui/tooltip";
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Avatar from "$lib/components/ui/avatar";
  import * as Tabs from "$lib/components/ui/tabs";
  import { Button } from "$lib/components/ui/button";
  import { Badge } from "$lib/components/ui/badge";
  import { Textarea } from "$lib/components/ui/textarea";
  import { Progress } from "$lib/components/ui/progress";

  import Forward from "lucide-svelte/icons/forward";
  import MessageCircle from "lucide-svelte/icons/message-circle";
  import ReceiptText from "lucide-svelte/icons/receipt-text";
  import GraduationCap from "lucide-svelte/icons/graduation-cap";
  import UserRound from "lucide-svelte/icons/user-round";
  import Mail from "lucide-svelte/icons/mail";
  import Locate from "lucide-svelte/icons/locate";

  import type { Request } from "$lib/server/database";
  import type { MultiStageData, UserInfo } from "./inboxTypes";

  import ChatArea from "../ChatArea.svelte";
  import InboxContentButtons from "./button_components/InboxContentButtons.svelte";

  export let requests: { [key: string]: Request };
  export let users: { [key: string]: UserInfo };
  export let multiStage: MultiStageData | null;

  $: stage = multiStage?.mainStage;

  export let updateSelectedStage: () => void;

  let processing = false;

  //todo change display when processing is true
  $: info = stage ? requests[stage.requestId] : null;
</script>

{#if multiStage && stage && info && requests[stage.requestId]}
  <Card.Root class="overflow-hidden">
    <Card.Header class="bg-muted/50 flex flex-row items-start">
      <div class="grid gap-0.5">
        <Card.Title class="group flex items-center gap-2 text-lg">
          {stage.stageTitle}
        </Card.Title>
        <Card.Description class="flex flex-col gap-2">
          <p class="text-bg-muted text-xs font-extralight">{stage.requestId}</p>

          <div>
            {#if stage.inboxType === "pending"}
              You Handled: <Badge variant="outline"
                >{stage.inboxStageTypeIndex}: {stage.inboxStageTitle}</Badge
              >
              {#each multiStage.otherStages as otherStage}
                <Badge variant="outline"
                  >{otherStage.inboxStageTypeIndex}: {otherStage.inboxStageTitle}</Badge
                >
              {/each}
              <br />
            {:else if stage.prevHandlerId in users}
              <div class="flex items-center gap-2">
                <div class="flex items-center gap-1">
                  <Forward size={10} />
                  <Avatar.Root class="h-4 w-4">
                    <Avatar.Image
                      src={users[stage.prevHandlerId].profileUrl}
                      alt="profile-url"
                    />
                    <Avatar.Fallback>CN</Avatar.Fallback>
                  </Avatar.Root>
                </div>
                <p>{users[stage.prevHandlerId].name}</p>
                <p />
                {#if stage.remarks}
                  <Badge>
                    {stage.remarks}
                  </Badge>
                {/if}
              </div>
            {/if}
            <br />
            Current Stage: <Badge variant="secondary">{stage.currentStageTypeIndex}: {stage.stageTitle}</Badge>
          </div>
        </Card.Description>
      </div>

      <div class="ml-auto flex items-center gap-2">
        <Button
          variant="outline"
          class="h-9.5 gap-2"
          on:click={() => {
            goto("/requests/" + stage.requestId);
          }}
        >
          <span class="flex items-center justify-center gap-2">
            <Locate size={18} /> View Progress
          </span>
        </Button>
      </div>
    </Card.Header>
    <Card.Content
      class="flex flex-grow flex-col gap-4 px-6 py-2 xl:h-[35.6rem]"
    >
      <Tabs.Root value="details">
        <Tabs.List>
          <Tabs.Trigger value="details" class="flex gap-2">
            <ReceiptText size={18} />
            Details</Tabs.Trigger
          >
          <Tabs.Trigger value="chat" class="flex gap-2"
            ><MessageCircle size={18} />Chat</Tabs.Trigger
          >
        </Tabs.List>

        <Tabs.Content value="details">
          <Card.Root>
            <Card.Content class="p-4">
              <div class="flex flex-col gap-4">
                <p class="text-sm font-semibold">Student Information</p>
                <div class="flex flex-wrap gap-4">
                  <Tooltip.Root>
                    <Tooltip.Trigger>
                      <Badge
                        variant="secondary"
                        class="flex gap-2 text-sm font-normal"
                      >
                        <GraduationCap size={18} />
                        {info.studentNumber}
                      </Badge>
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                      <p>Student Number</p>
                    </Tooltip.Content>
                  </Tooltip.Root>

                  <Tooltip.Root>
                    <Tooltip.Trigger>
                      <Badge
                        variant="secondary"
                        class="flex gap-2 text-sm font-normal"
                      >
                        <UserRound size={18} />
                        {info.studentName}
                      </Badge>
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                      <p>Student Name</p>
                    </Tooltip.Content>
                  </Tooltip.Root>

                  <Tooltip.Root>
                    <Tooltip.Trigger>
                      <Badge
                        variant="secondary"
                        class="flex gap-2 text-sm font-normal"
                      >
                        <Mail size={18} />
                        {info.studentEmail}
                      </Badge>
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                      <p>Student Email</p>
                    </Tooltip.Content>
                  </Tooltip.Root>
                </div>
                <p class="text-sm font-semibold">Purpose</p>
                <Textarea disabled value={info.purpose} />
                <p class="text-sm font-semibold">Remarks</p>
                <Textarea disabled value={info.remarks} />

                <p class="text-sm font-semibold">Progress</p>
                <Progress value={33} />
                <p class="text-sm font-semibold">
                  Copies: <span class="font-normal">{info.copies}</span>
                </p>
              </div>
            </Card.Content>
          </Card.Root>
        </Tabs.Content>

        <Tabs.Content value="chat">
          <div class="flex flex-col">
            <ChatArea
              requestId={stage.requestId}
              height="min-[320px]:h-[21.4rem] sm:max-lg:h-[21.4rem] xl:h-[26.25rem]"
            />
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </Card.Content>
    <Card.Footer>
      <div class="mt-auto flex w-full justify-end gap-4 pt-4">
        <InboxContentButtons
          request={requests[stage.requestId]}
          {multiStage}
          {users}
          {updateSelectedStage}
          bind:processing
        />
      </div>
    </Card.Footer>
  </Card.Root>
{/if}
