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
  import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte";
  import * as Tabs from "$lib/components/ui/tabs";
  import { Badge } from "$lib/components/ui/badge";
  import GraduationCap from "lucide-svelte/icons/graduation-cap";
  import UserRound from "lucide-svelte/icons/user-round";
  import Mail from "lucide-svelte/icons/mail";
  import { Textarea } from "$lib/components/ui/textarea";
  import EditForm from "./EditForm.svelte";

  export let data: any;
  export let processing: boolean;

  let formData = data.form;

  $: {
    formData = data.form;

    formData.data.studentNumber = data.studentNumber;
    formData.data.studentName = data.studentName;
    formData.data.studentEmail = data.studentEmail;
    formData.data.purpose = data.purpose;
    formData.data.remarks = data.remarks;
  }
</script>

<!--TODO add an error page?-->
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
            <CardTitle>
              {data.requestType.title}
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
            <CardTitle>
              {data.requestType.title}
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
    <Card class="mt-12 h-[46.5rem]  pt-6">
      <CardContent>
        <div class="flex flex-col gap-4">
          <EditForm bind:data={formData} bind:processing={processing} />

          <p class="font-semibold">Student Information</p>
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
          </div>
          <p class="font-semibold">Purpose</p>
          <Textarea disabled value={data.purpose} />
          <p class="font-semibold">Remarks</p>
          <Textarea disabled value={data.remarks} />
          <ChatArea requestId={data.requestId} height="h-60" />
        </div>
      </CardContent>
    </Card>
  </div>
</main>
