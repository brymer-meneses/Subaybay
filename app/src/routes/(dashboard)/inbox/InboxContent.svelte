<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Separator } from "$lib/components/ui/separator/index.js";

  import CheckCheck from "lucide-svelte/icons/check-check";
  import MoveLeft from "lucide-svelte/icons/move-left";
  import User from "lucide-svelte/icons/user";

  import ChatArea from "../ChatArea.svelte";

  import * as Card from "$lib/components/ui/card/index.js";
</script>

<Card.Root
  class="overflow-hidden"
  data-x-chunk-name="dashboard-05-chunk-4"
  data-x-chunk-description="An order details card with order details, shipping information, customer information and payment information."
>
  <Card.Header class="flex flex-row items-start bg-muted/50">
    <div class="grid gap-0.5">
      <Card.Title class="group flex items-center gap-2 text-lg">
        HD and GMC forwarded to UR for signature
      </Card.Title>
      <Card.Description>#00001</Card.Description>
    </div>

    <div class="ml-auto flex items-center gap-1">
      <Button size="sm" variant="outline" class="h-8 gap-1">
        <span class="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
          View Progress
        </span>
      </Button>
    </div>
  </Card.Header>
  <Card.Content class="p-6 text-sm">
    <div class="grid gap-3">
      <div class="font-semibold">Request Details</div>
      <ul class="grid gap-3">
        <li class="flex items-center justify-between">
          <span class="text-muted-foreground">
            Date <span></span>
          </span>
          <span>August 5, 2024</span>
        </li>
        <li class="flex items-center justify-between">
          <span class="text-muted-foreground">
            Student Name <span></span>
          </span>
          <span>Mr. Fresh D. Cat</span>
        </li>
        <li class="flex items-center justify-between">
          <span class="text-muted-foreground">
            Email <span></span>
          </span>
          <span>catfd@up.edu.ph</span>
        </li>
        <li class="flex items-center justify-between">
          <span class="text-muted-foreground">
            Student Number <span></span>
          </span>
          <span>2024-0069</span>
        </li>
        <li class="flex items-center justify-between">
          <span class="text-muted-foreground">
            Purpose <span></span>
          </span>
          <span>To eat fish</span>
        </li>
      </ul>
    </div>
    <div class="my-4 grid gap-3">
      <ChatArea roomId="abcd" />
    </div>

    <div class="flex gap-2">
      <Button class="gap-2 rounded-xl text-white">
        <CheckCheck />
        Finish
      </Button>
      <Button class="gap-2 rounded-xl text-white">
        <MoveLeft />
        Rollback
      </Button>
      <Button class="gap-2 rounded-xl text-white">
        <User />
        Reassign
      </Button>
    </div>
  </Card.Content>
  <Card.Footer class="flex flex-row items-center border-t bg-muted/50 px-6 py-3"
  ></Card.Footer>
</Card.Root>
