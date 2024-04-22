<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import Plus from "lucide-svelte/icons/plus";
</script>

<Dialog.Root>
  <Dialog.Trigger>
    <Button class="gap-4 p-3"><Plus size="20" /> Whitelist User</Button>
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Add a new User.</Dialog.Title>
    </Dialog.Header>
    <div class="grid gap-4 py-4">
      <div class="gap-cols-4 grid items-center gap-4">
        <Label for="username">Name:</Label>
        <Input id="username" class="col-span-3" />
      </div>
      <div class="gap-cols-4 grid items-center gap-4">
        <Label for="email">E-mail:</Label>
        <Input id="email" class="col-span-3" />
      </div>
    </div>
    <Dialog.Footer>
      <Button class="gap-4 px-10">Whitelist User</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
