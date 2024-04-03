<script lang="ts">
  import ChatArea from "$lib/components/general/ChatArea/ChatArea.svelte";
  import { page } from "$app/stores";
</script>

<div class="h-full w-full flex flex-col gap-4">
  <ChatArea
    email={$page.data.userInfo.email}
    senderProfileUrl={$page.data.userInfo.imageUrl}
    roomId="abcd"
  />
</div>
