<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import Plus from "lucide-svelte/icons/plus";
  import FilePlus from "lucide-svelte/icons/file-plus";
</script>

<Dialog.Root>
  <Dialog.Trigger>
    <Button class="gap-4 p-3"><FilePlus size="20" /> Create Request</Button>
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Add details for new request.</Dialog.Title>
    </Dialog.Header>
    <div class="grid gap-4 py-4">
      <div class="gap-cols-4 grid items-center gap-4">
        <Label for="studentnumber">Student Number:</Label>
        <Input id="studentnumber" class="col-span-3" />
      </div>
      <div class="gap-cols-4 grid items-center gap-4">
        <Label for="studentname">Student Name:</Label>
        <Input id="studentname" class="col-span-3" />
      </div>
      <div class="gap-cols-4 grid items-center gap-4">
        <Label for="studentemail">Student Email:</Label>
        <Input id="studentemail" class="col-span-3" />
      </div>
      <div class="gap-cols-4 grid items-center gap-4">
        <Label for="purpose">Purpose:</Label>
        <Input id="purpose" class="col-span-3" />
      </div>
    </div>
    <Dialog.Footer>
      <Button class="gap-2 rounded-xl text-white"><Plus />Add</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
