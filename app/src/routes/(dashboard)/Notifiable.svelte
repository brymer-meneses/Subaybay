<script lang="ts">
  export let active = false;
</script>

<div class="relative">
  <slot />
  <div
    class="absolute right-0 top-0 flex h-[8px] w-[8px] animate-ping items-center justify-center rounded-full bg-red-500 p-[3px] text-xs text-white drop-shadow-sm"
  />
  <div
    class="absolute right-0 top-0 flex h-[8px] w-[8px] items-center justify-center rounded-full bg-red-500 p-[3px] text-xs text-white drop-shadow-sm"
  />
</div>
