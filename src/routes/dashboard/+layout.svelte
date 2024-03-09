<script>
  import "../../app.pcss";
  import "@fontsource-variable/inter";
  import "@fontsource/poppins";
  import UP from "$lib/assets/UP.png";
</script>

<div class="fixed bg-up_maroon h-dvh w-20 flex flex-col justify-between">
  <!-- UP logo container -->
  <div
    class="flex items-center justify-center border-b border-[#FFFFFF55] h-20"
  >
    <div>
      <img src={UP} alt="UP logo" class="aspect-square p-3" />
    </div>
  </div>
  <!-- nav icons here -->
  <div class=" flex-grow flex flex-col gap-2 items-center space-y-4">
    <div class="relative group mt-4">
      <span
        class="absolute top-1/4 left-20 text-white bg-gray-600 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
        >Admin</span
      >
      <img
        src="https://placehold.co/50"
        alt="Log out"
        class="aspect-square m4 rounded-full"
      />
    </div>
    <div class="relative group">
      <span
        class="absolute top-1/4 left-20 text-white bg-gray-600 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
        >Staff Dashboard</span
      >
      <img
        src="https://placehold.co/50"
        alt="Log out"
        class="aspect-square m4 rounded-full"
      />
    </div>
    <div class="relative group">
      <span
        class="absolute top-1/4 left-20 text-white bg-gray-600 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
        >User Settings</span
      >
      <img
        src="https://placehold.co/50"
        alt="Log out"
        class="aspect-square m4 rounded-full"
      />
    </div>
  </div>
  <!-- logout  -->
  <div
    class="border-t border-[#FFFFFF55] h-20 flex items-center justify-center"
  >
    <div class="relative group">
      <span
        class="absolute top-1/4 left-20 text-white bg-gray-600 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
        >Logout</span
      >
      <img
        src="https://placehold.co/50"
        alt="Log out"
        class="aspect-square m4 rounded-full"
      />
    </div>
  </div>
</div>
<div
  class="ml-20 bg-gradient-to-tr to-red-100 from-white h-screen overflow-y-auto"
>
  <slot />
</div>
