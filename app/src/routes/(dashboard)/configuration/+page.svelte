<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { UserData, StageType } from "./configClasses";
  import Input from "$lib/components/ui/input/input.svelte";
  import type { PageServerData } from "./$types";
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "$lib/components/ui/card";
  import Plus from "lucide-svelte/icons/plus";
  import ConfigStage from "./ConfigStage.svelte";
  import { enhance } from "$app/forms";

  export let data: PageServerData;

  const defaultStages: StageType[] = [new StageType("Newly Created Request", ""), new StageType()];

  let stages: StageType[] = [];
  let title: string;
  let processing: boolean = false;

  let handlerOptions = [new UserData("", "None")];
  for (const [id, user] of Object.entries(data.users)) {
    handlerOptions.push(new UserData(user.id, user.name, user.profileUrl));

  }

  stages = defaultStages.map(stage => new StageType(stage.stageTitle, stage.defaultHandlerId));

  function deleteStage(index: number) {
    stages = stages.slice(0, index).concat(stages.slice(index + 1));
  }

  function addSubstage() {
    stages = [...stages, new StageType()];
  }

  function editHandler(stageIndex: number, defaultHandlerId: string) {
    console.log("Updated");
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
    formData.append("title", title);

    processing = true;

    return async ({ update, result }: any) => {
      await update();

      if(result.type === "success") {
        title = "";
        stages = defaultStages.map(stage => new StageType(stage.stageTitle, stage.defaultHandlerId));
      }

      processing = false;
    };
  }
</script>

<main class="flex justify-center">
  <div class="flex w-[40%] flex-col gap-4">
    <Input
      bind:value={title}
      class="focus-visible:ring-0"
      placeholder="Request Type Title (e.g. OTR-1)"
    />
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
        action="?/create"
        method="POST"
        use:enhance={(event) => {return handleSubmit(event)}}
      >
        {#if !processing}
          <Button type="submit">Create</Button>
        {:else}
          Processing... Please Wait
        {/if}
      </form>
    </div>
  </div>
</main>
