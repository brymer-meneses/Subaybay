<script lang="ts">
  import UP from "$lib/assets/UP.png";

  async function signInWithGoogle() {}
</script>

<div
  class="flex lg:flex-row flex-col items-center justify-center gap-28 w-screen h-screen"
>
  <div class="relative">
    <img src={UP} alt="up-logo" class="w-[500px] absolute z-20" />

    <div
      class="rounded-full bg-red-500 blur-[200px] aspect-square w-[400px] z-0 absolute top-10 bottom-20 left-40 animate-pulse transition"
    />
    <div
      class="rounded-full bg-green-500 blur-[200px] aspect-square w-[400px] z-10 left-5 animate-pulse delayed-start"
    />
  </div>

  <div class="flex flex-col gap-6 z-30">
    <h1
      class="text-8xl font-extrabold font-poppins text-up_maroon text-center lg:text-left"
    >
      Subaybay
    </h1>
    <h2 class="text-4xl font-inter font-thin text-center lg:text-left">
      Request Monitoring System
    </h2>

    <form method="GET" action="/auth/login">
      <button
        class="flex flex-row justify-center items-center gap-4 bg-white h-full p-4 z-20 rounded-lg drop-shadow-sm hover:bg-slate-100 w-full lg:w-64"
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
