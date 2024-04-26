<script context="module">
</script>

<script lang="ts">
  import { ScrollArea } from "$lib/components/ui/scroll-area";
  import ProgressViewStage from "./ProgressViewStage.svelte";

  export let request: any;
  export let requestType: any;
  export let users: { [_id: string]: { name: string; profileUrl: string } };

  interface SubstageData {
    title: string;
    handlerId: string;
    finished: boolean;
  }

  interface StageData {
    isHistory: boolean;
    isCurrent: boolean;
    substages: SubstageData[];
  }

  let stages: StageData[] = [];

  for (let stageArray of requestType.stages) {
    const stage: StageData = {
      isHistory: false,
      isCurrent: false,
      substages: [],
    };

    stages.push(stage);
    for (let stageType of stageArray) {
      const substage: SubstageData = {
        title: stageType.stageTitle,
        handlerId: stageType.defaultHandlerId,
        finished: false,
      };
      stage.substages.push(substage);
    }
  }

  for (let storedStage of request.history) {
    stages[storedStage.stageTypeIndex].isHistory = true;
    const substage =
      stages[storedStage.stageTypeIndex].substages[
        storedStage.substageTypeIndex
      ];
    substage.finished = true;
    substage.handlerId = storedStage.handlerId;
  }

  for (let storedStage of request.currentStages) {
    stages[storedStage.stageTypeIndex].isCurrent = true;
    const substage =
      stages[storedStage.stageTypeIndex].substages[
        storedStage.substageTypeIndex
      ];
    substage.finished = storedStage.finished;
    substage.handlerId = storedStage.handlerId;
  }

  for (let storedStage of request.nextStages) {
    const substage = stages[storedStage.stageTypeIndex].substages[
      storedStage.substageTypeIndex
    ];
    substage.finished = false;
    substage.handlerId = storedStage.handlerId;
  }
</script>

<!--Replace this div with it's actual container if needed-->
<div class="flex justify-center">
  <ScrollArea class="max-w-[600px] flex-grow gap-2">
    <div class="flex flex-col gap-2 p-2">
      {#each stages as stage}
        <ProgressViewStage {stage} {users} />
      {/each}
    </div>
  </ScrollArea>
</div>
