<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import * as Avatar from "$lib/components/ui/avatar";
  import { Label } from "$lib/components/ui/label";
  import { Badge } from "$lib/components/ui/badge";

  import { CircleUserRound } from "lucide-svelte";

  export let avatarSrc: string;
  export let avatarAlt: string;
  export let title: string;
  export let date: string;
  export let badge: string;
</script>

<Card.Card>
  <Card.CardContent class="flex flex-col gap-2 p-2">
    <div class="margin-top-1 flex flex-row items-center gap-2">
      <div class="ml-2">
        {#if !avatarSrc}
          <CircleUserRound class="h-8 w-8 stroke-muted-foreground stroke-1" />
        {:else}
          <Avatar.Avatar class="h-8 w-8">
            <Avatar.AvatarImage src={avatarSrc} alt={avatarAlt} />
          </Avatar.Avatar>
        {/if}
      </div>

      <Label class="flex flex-grow flex-row" placeholder="No Name">
        {title}
      </Label>
      {#if badge}
        <Badge variant="outline">
          {badge}
        </Badge>
      {/if}
    </div>
  </Card.CardContent>
  <Card.CardFooter class="text-xs text-gray-500">
    {date}
  </Card.CardFooter>
</Card.Card>
