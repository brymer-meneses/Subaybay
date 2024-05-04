<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Separator } from "$lib/components/ui/separator/index.js";

  import CheckCheck from "lucide-svelte/icons/check-check";
  import MoveLeft from "lucide-svelte/icons/move-left";
  import User from "lucide-svelte/icons/user";

  import ChatArea from "../ChatArea.svelte";

  import * as Card from "$lib/components/ui/card/index.js";
  import { Badge } from "$lib/components/ui/badge";
  import type { Request } from "$lib/server/database";
  import { Textarea } from "$lib/components/ui/textarea";

  export let requests: { [key: string]: Request };
  export let selectedStage: any;

  $: info = requests[selectedStage.requestId];
</script>

{#if selectedStage}
  <Card.Root class="overflow-hidden">
    <Card.Header class="flex flex-row items-start bg-muted/50">
      <div class="grid gap-0.5">
        <Card.Title class="group flex items-center gap-2 text-lg">
          {#if selectedStage}
            {selectedStage.stageTitle}
          {/if}
        </Card.Title>
        <Card.Description>#00001</Card.Description>
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
        <Button class="gap-2 rounded-xl text-white">
          <CheckCheck />
          Finish
        </Button>
        <Button class="gap-2 rounded-xl text-white">
          <MoveLeft />
          Rollback
        </Button>
        <Button class="gap-2 rounded-xl text-white">
          <User />
          Reassign
        </Button>
      </div>
    </Card.Content>
  </Card.Root>
{/if}
