<script lang="ts">
  import { ScrollArea } from "$lib/components/ui/scroll-area";
  import ProgressViewStage from "./ProgressViewStage.svelte";
  import type { Request, RequestType } from "$lib/server/database";

  export let request: Request;
  export let requestType: RequestType;
  export let users: { [_id: string]: { name: string; profileUrl: string } };

  interface StageData {
    isHistory: boolean;
    isCurrent: boolean;
    finished: boolean;
    title: string;
    handlerId: string;
  }

  let stages: StageData[] = [];

  for (const stageType of requestType.stages) {
    const stage: StageData = {
      isHistory: false,
      isCurrent: false,
      finished: false,
      title: stageType.stageTitle,
      handlerId: stageType.defaultHandlerId,
    };
    stages.push(stage);
  }

  if (request.history.length > 0) {
    let stageTypeIndex =
      request.history[request.history.length - 1].stageTypeIndex;

    // Don't mark stages past the current stage as finished
    if (request.currentStage)
      stageTypeIndex = Math.min(
        request.currentStage.stageTypeIndex - 1,
        stageTypeIndex,
      );

    for (let i = request.history.length - 1; i >= 0; i--) {
      if (stageTypeIndex < 0) break;
      if (request.history[i].stageTypeIndex != stageTypeIndex) continue;

      const storedStage = request.history[i];
      const stage = stages[storedStage.stageTypeIndex];
      stage.isHistory = true;
      stage.finished = storedStage.finished;
      stage.handlerId = storedStage.handlerId;

      stageTypeIndex--;
    }
  }

  if (request.currentStage) {
    const currentStage = stages[request.currentStage.stageTypeIndex];
    currentStage.finished = request.currentStage.finished;
    currentStage.handlerId = request.currentStage.handlerId;
    currentStage.isHistory = currentStage.finished;
    currentStage.isCurrent = !currentStage.finished;
  }

  const nextStageIndex = request.currentStage.stageTypeIndex + 1;
  if (stages.length > nextStageIndex) {
    stages[nextStageIndex].handlerId = request.nextHandlerId;
  }
</script>

<div class="flex flex-col gap-2 p-2">
  {#each stages as stage}
    <ProgressViewStage {stage} {users} />
  {/each}
</div>
