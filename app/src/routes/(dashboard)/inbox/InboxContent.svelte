<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Separator } from "$lib/components/ui/separator/index.js";

  import MoveLeft from "lucide-svelte/icons/move-left";
  import User from "lucide-svelte/icons/user";

  import ChatArea from "../ChatArea.svelte";
  import FinishButton from "./FinishButton.svelte";

  import * as Card from "$lib/components/ui/card/index.js";
  import { Badge } from "$lib/components/ui/badge";
  import type { Request } from "$lib/server/database";
  import { Textarea } from "$lib/components/ui/textarea";

  export let requests: { [key: string]: any };
  export let selectedStage: any;
  export let users: any;

  $: info = selectedStage ? requests[selectedStage.requestId] : null;
</script>

{#if selectedStage}
  <Card.Root class="overflow-hidden">
    <Card.Header class="bg-muted/50 flex flex-row items-start">
      <div class="grid gap-0.5">
        <Card.Title class="group flex items-center gap-2 text-lg">
          {#if selectedStage}
            {selectedStage.stageTitle}
          {/if}
        </Card.Title>
        <Card.Description>{selectedStage.requestId}</Card.Description>
      </div>

      <div class="ml-auto flex items-center gap-2">
        <Button size="sm" variant="outline" class="h-8 gap-1">
          <span class="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
            View Progress
          </span>
        </Button>
      </div>
    </Card.Header>
    <Card.Content class="p-6 text-sm">
      <div class="grid gap-3">
        <p class="font-semibold">Request Details</p>
        <div class="flex flex-row gap-2">
          <Badge>{info.studentNumber}</Badge>
          <Badge variant="secondary">{info.studentName}</Badge>
          <Badge variant="secondary">{info.studentEmail}</Badge>
        </div>

        {#if info.purpose !== ""}
          <Textarea disabled value={info.purpose} />
        {/if}
        {#if info.remarks !== ""}
          <Textarea disabled value={info.remarks} />
        {/if}
      </div>
      <div class="my-4 grid gap-3">
        <ChatArea roomId="abcd" />
      </div>

      <div class="flex gap-2">
        {#if !selectedStage.finished}
          <FinishButton selectedStage={selectedStage} users={users}/>
          
        {:else}
          <form action="?/recall_stage" method="POST">
            <input
              type="hidden"
              name="requestId"
              value={selectedStage.requestId}
            />
            <input
              type="hidden"
              name="stageTypeIndex"
              value={selectedStage.stageTypeIndex}
            />
            <Button class="gap-2 rounded-xl text-white">
              <MoveLeft />
              Rollback
            </Button>
          </form>
        {/if}
        <!-- <Button class="gap-2 rounded-xl text-white">
          <User />
          Reassign
        </Button> -->
      </div>
    </Card.Content>
  </Card.Root>
{/if}
