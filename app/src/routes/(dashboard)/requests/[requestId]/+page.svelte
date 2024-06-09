<script lang="ts">
  import HistoryView from "./HistoryView.svelte";
  import ProgressView from "./ProgressView.svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  import ChatArea from "../../ChatArea.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte";
  import * as Tabs from "$lib/components/ui/tabs";
  import { Badge } from "$lib/components/ui/badge";

  import {
    GraduationCap,
    UserRound,
    Mail,
    ArrowRight,
    FileText,
  } from "lucide-svelte/icons";

  import { Textarea } from "$lib/components/ui/textarea";
  import Options from "./Options.svelte";
  import type { Request, RequestType } from "$lib/server/database";
  import { goto } from "$app/navigation";
  import type { PageData } from "./$types";

  export let data: PageData;
  export let processing: boolean;
  let formData: any = data.form;
  let classification: "pending" | "finished" | "discontinued";

  $: {
    formData = data.form;

    formData.data.studentNumber = data.request.studentNumber;
    formData.data.studentName = data.request.studentName;
    formData.data.studentEmail = data.request.studentEmail;
    formData.data.purpose = data.request.purpose;
    formData.data.remarks = data.request.remarks;
    formData.data.copies = data.request.copies;

    if (!data.error.error) {
      classification = checkClassification(data.request, data.requestType);
    }
  }

  function checkClassification(
    request: Request,
    requestType: RequestType,
  ): "pending" | "finished" | "discontinued" {
    if (!request.isFinished) {
      return "pending";
    } else {
      const stageTypeIndex = request.currentStage.stageTypeIndex;
      const lastStage = requestType.stages.length - 1;
      return stageTypeIndex <= lastStage && !request.currentStage.finished
        ? "discontinued"
        : "finished";
    }
  }
</script>

{#if data.error.error}
  <main
    class="mx-6 flex h-[60vh] flex-col items-center justify-center space-y-1"
  >
    <div>
      <p class="text-9xl">404</p>
    </div>
    <p class="inline pb-10 font-semibold">Page not Found</p>

    <div class="">
      <details class="">
        <summary><pre class="inline">Details</pre></summary>
        <p class="">{data.error.message}</p>
        <pre>Request with ID of {data.error.requestId} does not exist.</pre>
      </details>
    </div>
    <Button variant="link" on:click={() => goto("/requests")}
      ><ArrowRight size="16" />Back To Requests</Button
    >
  </main>
{:else}
  <main class="mx-5 flex flex-col gap-8 xl:h-[85vh] xl:flex-row">
    <div class="flex h-full flex-grow flex-col xl:w-[50%]">
      {#key data}
        <Tabs.Root value="progress" class="flex h-full flex-col ">
          <div class="flex items-center">
            <Tabs.List>
              <Tabs.Trigger value="progress">Progress</Tabs.Trigger>
              <Tabs.Trigger value="history">History</Tabs.Trigger>
            </Tabs.List>
          </div>

          <Tabs.Content value="progress" class="flex-grow overflow-hidden">
            <Card.Root class="flex h-full flex-col overflow-hidden">
              <Card.Header>
                <Card.Title class="flex gap-2">
                  {data.requestType.title}<Badge variant="outline"
                    >{classification[0].toUpperCase() +
                      classification.slice(1, classification.length)}</Badge
                  >
                </Card.Title>
              </Card.Header>
              <Card.Content class="flex grow flex-col gap-2 overflow-hidden">
                <ScrollArea class="h-[60vh] px-4 xl:h-full">
                  <ProgressView
                    request={data.request}
                    requestType={data.requestType}
                    users={data.users}
                  />
                </ScrollArea>
              </Card.Content>
            </Card.Root>
          </Tabs.Content>

          <Tabs.Content value="history" class="flex-grow overflow-hidden">
            <Card.Root class="flex h-full flex-col overflow-hidden">
              <Card.Header>
                <Card.Title class="flex gap-2">
                  {data.requestType.title}<Badge variant="outline"
                    >{classification[0].toUpperCase() +
                      classification.slice(1, classification.length)}</Badge
                  >
                </Card.Title>
              </Card.Header>
              <Card.Content class="flex grow flex-col gap-2 overflow-hidden">
                <ScrollArea class="h-[60vh] px-4 xl:h-full">
                  <HistoryView
                    request={data.request}
                    requestType={data.requestType}
                    users={data.users}
                  />
                </ScrollArea>
              </Card.Content>
            </Card.Root>
          </Tabs.Content>
        </Tabs.Root>
      {/key}
    </div>

    <Card.Root class="flex h-full flex-grow flex-col pt-6 xl:w-[50%]">
      <Card.Content class="h-full">
        <div class="flex h-full flex-col gap-4">
          <div class="flex justify-between">
            <p class="font-semibold">Student Information</p>
            <Options bind:data={formData} users={data.users} bind:processing />
          </div>
          {#if processing}
            Processing... Please Wait
          {/if}
          <div class="flex flex-wrap gap-4">
            <Badge variant="secondary" class="flex gap-2 text-sm font-normal">
              <GraduationCap size={18} />
              {data.request.studentNumber}
            </Badge>
            <Badge variant="secondary" class="flex gap-2 text-sm font-normal">
              <UserRound size={18} />
              {data.request.studentName}
            </Badge>
            <Badge variant="secondary" class="flex gap-2 text-sm font-normal">
              <Mail size={18} />
              {data.request.studentEmail}
            </Badge>
            <Badge variant="secondary" class="flex gap-2 text-sm font-normal">
              <FileText size={18} />
              {data.request.copies}
            </Badge>
          </div>

          <div class="flex flex-col gap-2">
            <p class="text-sm font-semibold">Purpose</p>
            <Textarea disabled value={data.request.purpose} />
          </div>

          <div class="flex flex-col gap-2">
            <p class="text-sm font-semibold">Remarks</p>
            <Textarea disabled value={data.request.remarks} />
          </div>

          <div class="grow overflow-hidden">
            <ChatArea requestId={data.request._id} height="h-full" />
          </div>
        </div>
      </Card.Content>
    </Card.Root>
  </main>
{/if}
