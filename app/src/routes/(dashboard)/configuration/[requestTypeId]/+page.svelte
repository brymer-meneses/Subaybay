<script lang="ts">
  import type { PageServerData } from "./$types";
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";

  import ProcessingPleaseWait from "$lib/components/processing/ProcessingPleaseWait.svelte";
  import { Button } from "$lib/components/ui/button";
  import * as Dialog from "$lib/components/ui/dialog";
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "$lib/components/ui/card";

  import Plus from "lucide-svelte/icons/plus";
  import Eraser from "lucide-svelte/icons/eraser";
  import Pencil from "lucide-svelte/icons/pencil";

  import ConfigStage from "../ConfigStage.svelte";
  import { UserData, StageType } from "../configClasses";

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
    <h1 class="flex-grow text-center font-semibold">
      {requestType.title}
    </h1>
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

    {#if !processing}
      <div class="flex flex-row items-center justify-center gap-2">
        <div class="flex justify-center">
          <form
            action="?/edit"
            method="POST"
            use:enhance={(event) => {
              return handleSubmit(event);
            }}
          >
            <Button type="submit" class="h-9 gap-2">
              <Pencil size="18" />
              Accept Changes
            </Button>
          </form>
        </div>
        <!--Delete Button-->
        <div class="flex justify-center">
          <Dialog.Root>
            <Dialog.Trigger>
              <Button variant="destructive" class="h-9 gap-2">
                <Eraser size="18" />
                Delete
              </Button>
            </Dialog.Trigger>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Are you sure?</Dialog.Title>
                <Dialog.Description>
                  This will delete this request type, so that no new requests of
                  this type can be created
                  <br /><br />
                  Requests already using it will not be affected
                  <br />
                  This cannot be undone
                  <br />
                  Are you sure?
                </Dialog.Description>
              </Dialog.Header>

              <Dialog.Footer>
                <form
                  action="?/delete"
                  method="POST"
                  use:enhance={() => {
                    processing = true;
                    return async ({ update, result }) => {
                      await update();
                      processing = false;
                      if (result.type === "success") goto("../configuration");
                    };
                  }}
                >
                  <Button variant="destructive" type="submit">Delete</Button>
                </form>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Root>
        </div>
      </div>
    {:else}
      <ProcessingPleaseWait />
    {/if}
  </div>
</main>
