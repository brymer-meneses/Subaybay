<script lang="ts">
  export let profileUrl: string;
  export let name: string;
</script>

<div class="flex w-full">
  <div
    class="ml-4 flex w-fit items-center justify-center gap-3 rounded-2xl bg-white p-4"
  >
    <img
      src={profileUrl}
      alt="profile"
      class="h-5 w-5 rounded-full object-cover"
    />
    <p class="text-base text-black">{name}</p>
  </div>
</div>
