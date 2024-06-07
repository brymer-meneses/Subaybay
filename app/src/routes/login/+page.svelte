<script lang="ts">
  import UP from "$lib/assets/UP.png";
  import Oble from "$lib/assets/oble-2.jpg";

  import { toast } from "svelte-sonner";
  import { Button } from "$lib/components/ui/button/index.js";

  import * as Tooltip from "$lib/components/ui/tooltip/index.js";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import Copyright from "lucide-svelte/icons/copyright";
</script>

<div
  class="lg:min-h-[600px]xxx xl:min-h-[800px]xxx min-h-[100vh] w-full lg:grid lg:grid-cols-2"
>
  <div class="flex h-[100vh] items-center justify-center border py-12">
    <div class="mx-auto grid w-[350px] gap-6">
      <div class="grid gap-2 text-center">
        <div class="mb-2 flex justify-center">
          <img src={UP} alt="up-logo" class="h-[80px] w-[80px]" />
        </div>
        <h1 class="text-3xl font-bold">Welcome to UPB Subaybay!</h1>
        <p class="text-balance text-muted-foreground">
          Internal Request Tracker for the Office of the University Registrar.
        </p>
        <Separator />
      </div>
      <div class="grid gap-4">
        <div class="flex h-40 flex-col justify-end">
          <p class="text-sm text-muted-foreground">
            Sign in with Google to continue.
          </p>
        </div>
        <form method="GET" action="/auth/login">
          <Button
            variant="outline"
            class="w-full gap-2 py-6"
            on:click={() => {
              toast.loading("Logging in to Subaybay...");
            }}
            type="submit"
          >
            <img src="google.png" alt="google logo" class="w-8" />
            <p class="font-inter font-semibold">Sign in</p>
          </Button>
        </form>
      </div>
    </div>
  </div>
  <div class="relative hidden bg-muted lg:block">
    <img
      src={Oble}
      alt="placeholder"
      width="1920"
      height="1080"
      class="h-full w-full object-cover brightness-50 dark:brightness-[0.2] dark:grayscale"
    />
    <Tooltip.Root>
      <Tooltip.Trigger class="absolute bottom-4 right-4">
        <Copyright size="20" class="text-white" />
      </Tooltip.Trigger>
      <Tooltip.Content class="">
        <p>
          The image used is licensed under the <a
            href="https://en.wikipedia.org/wiki/Creative_Commons"
            target="_blank">Creative Commons</a
          >
          <a
            href="https://creativecommons.org/licenses/by-sa/4.0/deed.en"
            class="text-blue-500"
            target="_blank"
            >Attribution-Share Alike 4.0 International license.</a
          >
        </p>
        <p><span class="font-semibold">Date:</span> 29 June 2023, 11:20:44</p>
        <p><span class="font-semibold">Author:</span> Charrie Anne Nacor</p>
      </Tooltip.Content>
    </Tooltip.Root>
  </div>
</div>
