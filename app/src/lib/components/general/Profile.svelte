<script lang="ts">
  export let profileUrl: string;
  export let name: string;
</script>

<div class="w-full flex">
  <div
    class="flex justify-center items-center gap-3 bg-white w-fit rounded-2xl p-4 ml-4"
  >
    <img
      src={profileUrl}
      alt="profile"
      class="object-cover w-5 h-5 rounded-full"
    />
    <p class="text-base text-black">{name}</p>
  </div>
</div>
