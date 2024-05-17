<script lang="ts">
  import { goto } from "$app/navigation";

  import * as Card from "$lib/components/ui/card/index.js";
  import * as Avatar from "$lib/components/ui/avatar";
  import * as Tabs from "$lib/components/ui/tabs";
  import { Button } from "$lib/components/ui/button";
  import { Badge } from "$lib/components/ui/badge";
  import { Textarea } from "$lib/components/ui/textarea";

  import Forward from "lucide-svelte/icons/forward";
  import MessageCircle from "lucide-svelte/icons/message-circle";
  import ReceiptText from "lucide-svelte/icons/receipt-text";
  import GraduationCap from "lucide-svelte/icons/graduation-cap";
  import UserRound from "lucide-svelte/icons/user-round";
  import Mail from "lucide-svelte/icons/mail";
  import Locate from "lucide-svelte/icons/locate";

  import type { Request } from "$lib/server/database";
  import type { InboxStageData, UserInfo } from "./inboxTypes";
  import ChatArea from "../ChatArea.svelte";
  import InboxContentButtons from "./buttonComponents/InboxContentButtons.svelte";

  export let requests: { [key: string]: Request };
  export let stage: InboxStageData | null;
  export let users: { [key: string]: UserInfo };

  export let updateSelectedStage: () => void;

  let processing = false;
  //todo change display when processing is true

  $: info = stage ? requests[stage.requestId] : null;
</script>

{#if stage && info}
  <Card.Root class="overflow-hidden">
    <Card.Header class="flex flex-row items-start bg-muted/50">
      <div class="grid gap-0.5">
        <Card.Title class="group flex items-center gap-2 text-lg">
          {stage.stageTitle}
        </Card.Title>
        <Card.Description class="flex flex-col gap-2">
          <p class="text-bg-muted text-xs font-extralight">{stage.requestId}</p>

          <div>
            {#if stage.inboxType === "pending"}
              You handled Stage {stage.inboxStageTypeIndex}: {stage.inboxStageTitle}
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
              </div>
            {/if}
            Currently at Stage {stage.currentStageTypeIndex}: {stage.stageTitle}
          </div>
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
          <span
            class="flex items-center justify-center gap-2 lg:sr-only xl:not-sr-only xl:whitespace-nowrap"
          >
            <Locate size={15} /> View Progress
          </span>
        </Button>
      </div>
    </Card.Header>
    <Card.Content class="flex flex-col gap-4 p-6 text-sm">
      <Tabs.Root value="details">
        <Tabs.List>
          <Tabs.Trigger value="details" class="flex gap-2"
            ><ReceiptText size={15} />Details</Tabs.Trigger
          >
          <Tabs.Trigger value="chat" class="flex gap-2"
            ><MessageCircle size={15} />Chat</Tabs.Trigger
          >
        </Tabs.List>

        <Tabs.Content value="details">
          <Card.Root>
            <Card.Content class="p-4">
              <div class="flex flex-col gap-4">
                <p class="text-xs font-semibold">Student Information</p>
                <div class="flex flex-wrap gap-4">
                  <Badge variant="secondary" class="flex gap-2 font-normal">
                    <GraduationCap size={15} />
                    {info.studentNumber}
                  </Badge>
                  <Badge variant="secondary" class="flex gap-2 font-normal">
                    <UserRound size={15} />
                    {info.studentName}
                  </Badge>
                  <Badge variant="secondary" class="flex gap-2 font-normal">
                    <Mail size={15} />
                    {info.studentEmail}
                  </Badge>
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

      <InboxContentButtons
        request={requests[stage.requestId]}
        {stage}
        {users}
        {updateSelectedStage}
        bind:processing
      />
    </Card.Content>
  </Card.Root>
{/if}
