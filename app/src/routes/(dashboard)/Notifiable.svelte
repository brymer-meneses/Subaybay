<script lang="ts">
  export let count: number = 0;
</script>

<div class="relative">
  <slot />
  {#if count !== 0}
    <div
      class="absolute right-[-10px] top-[-10px] flex w-[15px] items-center justify-center rounded-full bg-red-500 p-[3px] text-xs text-white drop-shadow-sm"
    >
      {count}
    </div>
  {/if}
</div>
