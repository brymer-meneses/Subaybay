<script lang="ts">
  import UP from "$lib/assets/UP.png";

  import { goto } from "$app/navigation";
  import { Button } from "$lib/components/ui/button/index.js";
</script>

<main
  class="flex h-[100vh] flex-col overflow-hidden border bg-slate-50 xl:[&>div]:px-[20vh]"
>
  <div class="flex flex-row items-center justify-between px-10 py-10">
    <img src={UP} alt="" class="h-[75px] w-[75px]" />
    <div class="flex flex-row gap-4 xl:gap-6">
      <Button
        variant="link"
        class="text-lg font-semibold"
        on:click={() => goto("/login")}>Login</Button
      >
      <Button
        variant="link"
        class="text-lg font-semibold"
        on:click={() => window.open("/docs", "_blank")}>Manual</Button
      >
    </div>
  </div>
  <div
    class="hero relative flex flex-grow flex-col justify-center border bg-slate-100 p-10 backdrop-blur-lg"
  >
    <!-- <div
        class="pointer-events-none absolute m-0 flex h-full w-full items-center justify-center"
      >
        <div class="ball -z-10 aspect-square h-[80%] rotate-[20deg]"></div>
      </div> -->
    <p class="subtext gap-2 text-xl text-[#D69A22]">
      Internal <span class="text-[#760d11]">Request</span>
      <span class="not-italic text-black">Tracker:</span>
    </p>
    <p class="maintext font-serif text-8xl font-bold">
      UPB <br /> Subaybay
    </p>
    <p class="subtext gap-2 text-xl">CMSC 128</p>
  </div>
  <div
    class="flex-end flex grow flex-row items-center space-x-16 bg-slate-200 px-10 py-10"
  >
    <div class="flex flex-row space-x-20">
      <div>
        <p class="mb-2 text-xl font-semibold">Team ZEBrA:</p>
        <ul class="space-y-1">
          <li class="truncate">Zedrick De Guzman</li>
          <li class="truncate">Grandemir Baysa-Pee</li>
          <li class="truncate">Brymer Bernard Meneses</li>
          <li class="truncate">Andre Bryant Bagalso</li>
        </ul>
      </div>
      <div>
        <p class="mb-2 text-xl font-semibold">Client:</p>
        <p>Office of the University Registrar (UP Baguio)</p>
      </div>
    </div>
  </div>
</main>

<style>
  .ball {
    background: linear-gradient(
      calc(180deg + 50deg),
      #f8af7a 20%,
      #f86217 40%,
      #760d11
    );
    filter: blur(20px);
    animation: 225s test-animate infinite linear;
  }

  @keyframes test-animate {
    from {
      rotate: 0deg;
    }
    to {
      rotate: 360deg;
    }
  }
</style>
