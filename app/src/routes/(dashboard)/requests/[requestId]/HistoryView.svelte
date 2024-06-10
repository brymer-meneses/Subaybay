<script lang="ts">
  import type { Request, RequestType } from "$lib/server/database";
  import HistoryViewEntry from "./HistoryViewEntry.svelte";

  // A copy of Stage, with less data
  interface StageData {
    title: string;
    handlerId: string;
    date: Date;
    remarks: string;
  }

  export let request: Request;
  export let requestType: RequestType;
  export let users: { [_id: string]: { name: string; profileUrl: string } };

  let history: StageData[] = [];

  for (const storedStage of request.history) {
    const historicalStage: StageData = {
      title: requestType.stages[storedStage.stageTypeIndex].stageTitle,
      handlerId: storedStage.handlerId,
      date: storedStage.dateFinished,
      remarks: storedStage.remarks,
    };
    history.push(historicalStage);
  }

  const currentStage: StageData = {
    title: requestType.stages[request.currentStage.stageTypeIndex].stageTitle,
    handlerId: request.currentStage.handlerId,
    date: request.currentStage.dateStarted,
    remarks: "Current",
  };
</script>

<div class="flex flex-col gap-2 p-2">
  {#each history as stage}
    <HistoryViewEntry
      avatarSrc={users[stage.handlerId]?.profileUrl}
      avatarAlt={users[stage.handlerId]?.name}
      title={stage.title}
      date={"Finished " + stage.date.toString()}
      badge={stage.remarks}
    />
  {/each}
  <!--Current Stage-->
  <!--Only show if request is pending or stale-->
  {#if !request.isFinished || !request.currentStage.finished}
  <HistoryViewEntry
    avatarSrc={users[currentStage.handlerId]?.profileUrl}
    avatarAlt={users[currentStage.handlerId]?.name}
    title={currentStage.title}
    date={"Started " + currentStage.date.toString()}
    badge={currentStage.remarks}
  />
  {/if}
</div>
