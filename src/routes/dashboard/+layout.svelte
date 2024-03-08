<script>
  import "../../app.pcss";
  import "@fontsource-variable/inter";
  import "@fontsource/poppins";
  import UP from "$lib/assets/UP.png";
</script>

<div class="fixed bg-up_maroon h-dvh w-20">
  <!-- UP logo container -->
  <div class="flex items-center justify-center border-b">
    <img src={UP} alt="UP logo" class="h- aspect-square rounded-full m-2" />
  </div>
  <!-- icons container -->
  <div class="flex flex-col h-full">
    <!-- replace with icons -->
    <img
      src="https://placehold.co/50"
      alt="UP logo"
      class="h-20 aspect-square rounded-full"
    />
    <img
      src="https://placehold.co/50"
      alt="UP logo"
      class="h-20 aspect-square rounded-full"
    />
    <img
      src="https://placehold.co/50"
      alt="UP logo"
      class="h-20 aspect-square rounded-full text-white"
    />
  </div>
  <!-- logout  -->
  <div class="absolute bottom-0 border-t">
    <img
      src="https://placehold.co/50"
      alt="UP logo"
      class="h-20 aspect-square rounded-full"
    />
  </div>
</div>
<slot />
