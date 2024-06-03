<script lang="ts">
  import UP from "$lib/assets/UP.png";

  import { goto } from "$app/navigation";
  import { Button } from "$lib/components/ui/button/index.js";
</script>

<main class="bg-slate-50m relative m-0 mx-auto block h-[100vh] bg-slate-50">
  <div
    class="pointer-events-none absolute flex h-full w-full items-center justify-center"
  >
    <div class="ball h-[500px] w-[500px] rounded-full"></div>
  </div>
  <div class=" z-10 mx-auto block flex h-full flex-col space-y-10 xl:w-[75%]">
    <div class="flex h-64 flex-row items-end justify-between px-10 pb-5">
      <img src={UP} alt="" class="h-[75px] w-[75px]" />
      <div class="flex flex-row gap-8">
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
      <p class="font-serif text-8xl font-bold">
        Hi, I'm <br />Pawel Olek
      </p>
      <p class="gap-2 text-xl italic text-[#f43e01]">
        UI designer <span class="not-italic text-black">&</span> Illustrator
      </p>
    </div>
    <div class="grow p-10">
      <p class="text-xl">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Pariatur
        aliquam alias at dolores totam tempore tempora? Velit dolorum impedit,
        voluptatum deserunt facilis, in magnam quae vel maiores, cumque a odio!
      </p>
    </div>
  </div>
</main>

<style>
  .ball {
    background: linear-gradient(
      calc(180deg + 50deg),
      #f8af7a 20%,
      #f86217 40%,
      #f43e01
    );
    filter: blur(20px);
  }
</style>
