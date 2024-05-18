<script lang="ts">
  import HistoryView from "./HistoryView.svelte";
  import ProgressView from "./ProgressView.svelte";
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "$lib/components/ui/card";
  import ChatArea from "../../ChatArea.svelte";

  export let data: any;
</script>

<!--TODO add an error page?-->
<main class="mx-5 grid grid-cols-3 gap-4">
  <div class="flex flex-col gap-4">
    <Card class="flex flex-col">
      <CardHeader>
        <CardTitle>Progress:</CardTitle>
      </CardHeader>
      <CardContent class="flex flex-col gap-2">
        <ProgressView
          request={data.request}
          requestType={data.requestType}
          users={data.users}
        />
      </CardContent>
    </Card>
  </div>
  <div>
    <Card class="flex flex-col">
      <CardHeader>
        <CardTitle>History:</CardTitle>
      </CardHeader>
      <CardContent class="flex flex-col gap-2">
        <HistoryView
          request={data.request}
          requestType={data.requestType}
          users={data.users}
        />
      </CardContent>
    </Card>
  </div>
  <div>
    <ChatArea roomId="abcd" />
  </div>
</main>
