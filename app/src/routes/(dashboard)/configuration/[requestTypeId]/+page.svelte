<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import Input from "$lib/components/ui/input/input.svelte";
  import type { PageServerData } from "./$types";
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "$lib/components/ui/card";
  import Plus from "lucide-svelte/icons/plus";
  import { enhance } from "$app/forms";
  import { UserData, StageType } from "../configClasses";
  import ConfigStage from "../ConfigStage.svelte";
  import Label from "$lib/components/ui/label/label.svelte";

  export let data: PageServerData;

  let stages: StageType[] = [];
  let processing: boolean = false;

  let requestType = data.requestType;

  let existingStages: StageType[] = [];

  let handlerOptions = [new UserData("", "None")];
  for (const [id, user] of Object.entries(data.users)) {
    handlerOptions.push(new UserData(user.id, user.name, user.profileUrl));
  }

  existingStages = requestType.stages;

  stages = existingStages.map(
    (stage) => new StageType(stage.stageTitle, stage.defaultHandlerId),
  );

  function deleteStage(index: number) {
    stages = stages.slice(0, index).concat(stages.slice(index + 1));
  }

  function addSubstage() {
    stages = [...stages, new StageType()];
  }

  function editHandler(stageIndex: number, defaultHandlerId: string) {
    stages[stageIndex].defaultHandlerId = defaultHandlerId;
    stages = stages;
  }

  async function handleSubmit(e: {
    action: URL;
    formData: FormData;
    formElement: HTMLFormElement;
    controller: AbortController;
    submitter: HTMLElement | null;
    cancel(): void;
  }) {
    const formData = e.formData;

    formData.append("stageData", JSON.stringify(stages));
    formData.append("requestTypeId", data.requestType._id);

    processing = true;

    return async ({ update, result }: any) => {
      await update();
      processing = false;
    };
  }
</script>

<main class="flex justify-center">
  <div class="flex w-[40%] flex-col gap-4">
    <Label>
      {requestType.title}
    </Label>
    <Card class="flex flex-col border-gray-300">
      <CardHeader>
        <CardTitle>Stages</CardTitle>
        <CardDescription>
          Note: the first stage is always the creation stage, it cannot be
          removed
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-2">
        {#each stages as stageType, stageIndex}
          <ConfigStage
            bind:stageTitle={stageType.stageTitle}
            isDeletable={stageIndex !== 0}
            isRenamable={stageIndex !== 0}
            {stageIndex}
            handlerId={stageType.defaultHandlerId}
            deleteFunction={deleteStage}
            onHandlerEdited={editHandler}
            users={data.users}
            {handlerOptions}
          />
        {/each}

        <!--Button for adding new stage-->
        <Button variant="outline" class="w-full" on:click={addSubstage}>
          <Plus class="stroke-muted-foreground stroke-1" />
        </Button>
      </CardContent>
    </Card>

    <div class="flex justify-center">
      <form
        action="?/edit"
        method="POST"
        use:enhance={(event) => {
          return handleSubmit(event);
        }}
      >
        {#if !processing}
          <!--Todo add confirmation-->
          <Button type="submit">Accept Changes</Button>
        {:else}
          Processing... Please Wait
        {/if}
      </form>
    </div>
  </div>
</main>
