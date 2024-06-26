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
  import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte";
  import Plus from "lucide-svelte/icons/plus";
  import ConfigStage from "./ConfigStage.svelte";
  import { enhance } from "$app/forms";
  import RequestTypeList from "./RequestTypeList.svelte";
  import ConfigConfirmation from "./ConfigConfirmation.svelte";

  export let data: PageServerData;

  const defaultStages: StageType[] = [
    new StageType("Newly Created Request", ""),
    new StageType(),
  ];

  let stages: StageType[] = [];
  let title: string;
  let processing: boolean = false;

  let handlerOptions = [new UserData("", "None")];
  for (const [id, user] of Object.entries(data.users)) {
    handlerOptions.push(new UserData(user.id, user.name, user.profileUrl));
  }

  stages = defaultStages.map(
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
    formData.append("title", title);

    processing = true;

    return async ({ update, result }: any) => {
      await update();

      if (result.type === "success") {
        title = "";
        stages = defaultStages.map(
          (stage) => new StageType(stage.stageTitle, stage.defaultHandlerId),
        );
      }

      processing = false;
    };
  }
</script>

<!-- TODO add Responsive layout -->
<main class="flex flex-col justify-between gap-8 px-8 xl:h-[85vh] xl:flex-row">
  <div class="h-full xl:w-[30%]">
    <RequestTypeList requestTypes={data.requestTypes} />
  </div>
  <div class="flex h-full flex-grow flex-col gap-4 xl:w-[70%]">
    <Input
      bind:value={title}
      class="focus-visible:ring-0"
      placeholder="Request Type Title (e.g. OTR-1)"
    />
    <Card class="flex h-full flex-col overflow-hidden">
      <CardHeader>
        <CardTitle>Stages</CardTitle>
        <CardDescription>
          Note: the first stage is always the creation stage, it cannot be
          edited.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex grow flex-col gap-2 overflow-hidden">
        <ScrollArea class="h-[50vh] px-4 xl:h-full">
          {#each stages as stageType, stageIndex}
            <div class="mb-4">
              <ConfigStage
                bind:stageTitle={stageType.stageTitle}
                {stageIndex}
                handlerId={stageType.defaultHandlerId}
                deleteFunction={deleteStage}
                onHandlerEdited={editHandler}
                users={data.users}
                {handlerOptions}
              />
            </div>
          {/each}
        </ScrollArea>
        <!--Button for adding new stage-->
      </CardContent>
      <CardFooter class="flex flex-col gap-4">
        <div class="w-full">
          <Button variant="outline" class="w-full" on:click={addSubstage}>
            <Plus class="stroke-muted-foreground stroke-1" />
          </Button>
        </div>
        <div class="flex w-full justify-start">
          <ConfigConfirmation requestTypeTitle={title} {processing}>
            <form
              action="?/create"
              method="POST"
              use:enhance={(event) => {
                return handleSubmit(event);
              }}
            >
              <Button type="submit">Create</Button>
            </form>
          </ConfigConfirmation>
        </div>
      </CardFooter>
    </Card>
  </div>
</main>
