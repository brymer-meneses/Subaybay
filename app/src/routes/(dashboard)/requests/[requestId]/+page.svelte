<script lang="ts">
  import HistoryView from "./HistoryView.svelte";
  import ProgressView from "./ProgressView.svelte";
  import {
    Card,
    CardContent,
    CardTitle,
    CardHeader,
  } from "$lib/components/ui/card";
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

  export let data: any;
  export let processing: boolean;
  let formData: any = data.form;
  let classification: "pending" | "finished" | "discontinued";

  $: {
    formData = data.form;

    formData.data.studentNumber = data.studentNumber;
    formData.data.studentName = data.studentName;
    formData.data.studentEmail = data.studentEmail;
    formData.data.purpose = data.purpose;
    formData.data.remarks = data.remarks;
    formData.data.copies = data.copies;

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
  <main class="mx-5 grid grid-cols-2 gap-4">
    <div class="flex flex-col">
      <Tabs.Root value="progress">
        <Tabs.List>
          <Tabs.Trigger value="progress">Progress</Tabs.Trigger>
          <Tabs.Trigger value="history">History</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="progress">
          <Card>
            <CardHeader>
              <CardTitle class="flex gap-2">
                {data.requestType.title}<Badge variant="outline"
                  >{classification[0].toUpperCase() +
                    classification.slice(1, classification.length)}</Badge
                >
              </CardTitle>
            </CardHeader>
            <CardContent class="flex flex-col gap-2">
              <ScrollArea class="h-[39rem] px-4">
                <ProgressView
                  request={data.request}
                  requestType={data.requestType}
                  users={data.users}
                />
              </ScrollArea>
            </CardContent>
          </Card>
        </Tabs.Content>

        <Tabs.Content value="history">
          <Card>
            <CardHeader>
              <CardTitle class="flex gap-2">
                {data.requestType.title}<Badge variant="outline"
                  >{classification[0].toUpperCase() +
                    classification.slice(1, classification.length)}</Badge
                >
              </CardTitle>
            </CardHeader>
            <CardContent class="flex flex-col gap-2">
              <ScrollArea class="h-[39rem] px-4">
                <HistoryView
                  request={data.request}
                  requestType={data.requestType}
                  users={data.users}
                />
              </ScrollArea>
            </CardContent>
          </Card>
        </Tabs.Content>
      </Tabs.Root>
    </div>

    <div class="flex flex-col gap-4">
      <Card class="mt-12 h-[45rem]  pt-6">
        <CardContent>
          <div class="flex flex-col gap-4">
            <div class="flex justify-between">
              <p class="font-semibold">Student Information</p>
              <Options
                bind:data={formData}
                users={data.users}
                bind:processing
              />
            </div>
            {#if processing}
              Processing... Please Wait
            {/if}
            <div class="flex flex-wrap gap-4">
              <Badge variant="secondary" class="flex gap-2 text-sm">
                <GraduationCap size={18} />
                {data.studentNumber}
              </Badge>
              <Badge variant="secondary" class="flex gap-2 text-sm">
                <UserRound size={18} />
                {data.studentName}
              </Badge>
              <Badge variant="secondary" class="flex gap-2 text-sm">
                <Mail size={18} />
                {data.studentEmail}
              </Badge>
              <Badge variant="secondary" class="flex gap-2 text-sm">
                <FileText size={18} />
                {data.copies}
              </Badge>
            </div>
            <p class="font-semibold">Purpose</p>
            <Textarea disabled value={data.purpose} />
            <p class="font-semibold">Remarks</p>
            <Textarea disabled value={data.remarks} />
            <ChatArea requestId={data.requestId} height="h-56" />
          </div>
        </CardContent>
      </Card>
    </div>
  </main>
{/if}
