<script lang="ts">
  import UP from "$lib/assets/UP.png";

  import { goto } from "$app/navigation";
  import { Button } from "$lib/components/ui/button/index.js";
</script>

<main class="bg-slate-50m relative m-0 mx-auto block h-[100vh] bg-slate-50">
  <div
    class="pointer-events-none absolute flex h-full w-full items-center justify-center"
  >
    <div
      class="ball h-[300px] w-[300px] rotate-[20deg] md:h-[400px] md:w-[400px] xl:h-[500px] xl:w-[500px]"
    ></div>
  </div>
  <div
    class=" z-10 mx-auto flex h-full flex-col justify-between space-y-10 xl:block xl:w-[75%]"
  >
    <div class="flex h-60 flex-row items-end justify-between px-10 pb-5">
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
          on:click={() => goto("/login")}>Docs</Button
        >
      </div>
    </div>
    <div class="hero h-[350px] p-10 backdrop-blur-lg">
      <p class="subtext gap-2 text-xl text-[#D69A22]">
        Internal <span class="text-[#760d11]">Request</span>
        <span class="not-italic text-black">Tracker:</span>
      </p>
      <p class="maintext font-serif text-8xl font-bold">
        UPB <br /> Subaybay
      </p>
      <p class="subtext gap-2 text-xl">CMSC 128</p>
    </div>
    <div class="flex grow flex-row space-x-16 p-10">
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
        <p class="mb-2">Office of the University Registrar (UP Baguio)</p>
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
    animation: 200s test-animate infinite linear;
    /* uncomment for christmas light */
    /* animation: 1s christmas-light infinite linear !important; */
  }

  @keyframes test-animate {
    from {
      rotate: 0deg;
    }
    to {
      rotate: 360deg;
    }
  }

  @keyframes christmas-light {
    from {
      rotate: 0deg;
      background: linear-gradient(
        calc(180deg + 50deg),
        #f8af7a 20%,
        #f86217 40%,
        #760d11
      );
    }
    to {
      rotate: 360deg;
      background: linear-gradient(
        calc(180deg + 50deg),
        #7af8af 20%,
        #17f862 40%,
        #01f43e
      );
    }
  }
</style>
