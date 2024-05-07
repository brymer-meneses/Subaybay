<script lang="ts">
  import Package2 from "lucide-svelte/icons/package-2";
  import UsersRound from "lucide-svelte/icons/users-round";

  import Home from "lucide-svelte/icons/home";
  import LineChart from "lucide-svelte/icons/line-chart";
  import Package from "lucide-svelte/icons/package";
  import PanelLeft from "lucide-svelte/icons/panel-left";
  import Search from "lucide-svelte/icons/search";
  import ShoppingCart from "lucide-svelte/icons/shopping-cart";
  import CommandBox from "./CommandBox.svelte";

  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
  import * as Tooltip from "$lib/components/ui/tooltip";

  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import * as Sheet from "$lib/components/ui/sheet/index.js";

  import { page } from "$app/stores";

  $: title = $page.route.id?.toString().split("/").at(-1);

  let open = false;
</script>

<header
  class="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6"
>
  <Sheet.Root>
    <Sheet.Trigger asChild let:builder>
      <Button
        builders={[builder]}
        size="icon"
        variant="outline"
        class="sm:hidden"
      >
        <PanelLeft class="h-5 w-5" />
        <span class="sr-only">Toggle Menu</span>
      </Button>
    </Sheet.Trigger>
    <Sheet.Content side="left" class="sm:max-w-xs">
      <nav class="grid gap-6 text-lg font-medium">
        <a
          href="##"
          class="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
        >
          <Package2 class="h-5 w-5 transition-all group-hover:scale-110" />
          <span class="sr-only">Acme Inc</span>
        </a>
        <a
          href="##"
          class="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
        >
          <Home class="h-5 w-5" />
          Dashboard
        </a>
        <a href="##" class="flex items-center gap-4 px-2.5 text-foreground">
          <ShoppingCart class="h-5 w-5" />
          Orders
        </a>
        <a
          href="##"
          class="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
        >
          <Package class="h-5 w-5" />
          Products
        </a>
        <a
          href="##"
          class="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
        >
          <UsersRound class="h-5 w-5" />
          Customers
        </a>
        <a
          href="##"
          class="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
        >
          <LineChart class="h-5 w-5" />
          Settings
        </a>
      </nav>
    </Sheet.Content>
  </Sheet.Root>

  <div class="relative ml-auto flex-1 items-center md:grow-0">
    <Button
      variant="ghost"
      class="flex w-full cursor-pointer flex-row items-center justify-between rounded-lg border border-border bg-background md:w-[200px] lg:w-[320px]"
      on:click={() => {
        open = !open;
      }}
    >
      <div class="flex flex-row gap-4">
        <Search class="h-4 w-4 text-muted-foreground" />
        <p class="text-xs text-muted-foreground">Click here to search ...</p>
      </div>
      <kbd
        class="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 drop-shadow-sm"
      >
        <span class="text-xs">⌘</span>J
      </kbd>
    </Button>
  </div>

  <Tooltip.Root>
    <Tooltip.Trigger>
      <img
        src={$page.data.userInfo.profileUrl}
        width={36}
        height={36}
        alt="Avatar"
        class="overflow-hidden rounded-full"
      />
    </Tooltip.Trigger>
    <Tooltip.Content>
      <p>{$page.data.userInfo.name}</p>
      <p>{$page.data.userInfo.email}</p>
    </Tooltip.Content>
  </Tooltip.Root>
</header>

<CommandBox bind:open />
