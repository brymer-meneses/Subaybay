<script>
  import "../app.pcss";

  import * as Avatar from "$lib/components/ui/avatar";
</script>

<main class="flex flex-col h-full w-full gap-5">

  <!-- Nav Bar -->
  <nav class="flex flex-row place-items-center justify-between h-full w-full bg-[#1a1b1d] bg-gradient-to-bl from-[#3a3b3d] text-[#d9d9d9] m-0 p-3">
    <h1 class="border-2 border-red-600">UPB DocuTrack</h1>

    <Avatar.Root class="border-2 border-red-600">
      <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
      <Avatar.Fallback>CN</Avatar.Fallback>
    </Avatar.Root>

  </nav>

  <div class="h-full w-full p-4">
    <slot />
  </div>

</main>


