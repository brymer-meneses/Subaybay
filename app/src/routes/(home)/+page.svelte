<script lang="ts">
  import UP from "$lib/assets/UP.png";

  import { toast } from "svelte-sonner";
</script>

<div
  class="flex h-screen w-screen flex-col items-center justify-center gap-28 lg:flex-row"
>
  <div class="relative">
    <img src={UP} alt="up-logo" class="absolute z-20 w-[500px]" />

    <div
      class="absolute bottom-20 left-40 top-10 z-0 aspect-square w-[400px] animate-pulse rounded-full bg-red-500 blur-[200px] transition"
    />
    <div
      class="delayed-start left-5 z-10 aspect-square w-[400px] animate-pulse rounded-full bg-green-500 blur-[200px]"
    />
  </div>

  <div class="z-30 flex flex-col gap-6">
    <h1
      class="font-poppins text-up_maroon text-center text-8xl font-extrabold lg:text-left"
    >
      Subaybay
    </h1>
    <h2 class="font-inter text-center text-4xl font-thin lg:text-left">
      Request Monitoring System
    </h2>

    <form method="GET" action="/auth/login">
      <button
        class="z-20 flex h-full w-full flex-row items-center justify-center gap-4 rounded-lg bg-white p-4 drop-shadow-sm hover:bg-slate-100 lg:w-64"
        on:click={() => {
          toast.loading("Logging in to Subaybay...");
        }}
        type="submit"
      >
        <img src="google.png" alt="google logo" class="w-10" />
        <p class="font-inter font-normal">Sign in with Google</p>
      </button>
    </form>
  </div>
</div>

<style>
  .delayed-start {
    animation-delay: 0.5s;
  }
</style>
