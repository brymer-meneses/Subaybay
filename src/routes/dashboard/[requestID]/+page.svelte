<script lang="ts">
    import NodeGraph from "$lib/components/requestFlow/nodeGraph.svelte";

</script>

<!--TODO turn these to components later -->
<div class="">
  <div class="h-dvh py-10 w-10/12 mx-auto space-y-6">
    <div>
      <h2 class="text-2xl">Request Name Here</h2>
      <div class="h-[200px] flex items-center justify-between">
        <NodeGraph></NodeGraph>
        <!-- hover on the nodes to show details? like this maybe. Just a suggestion haha. You can delete these nodes (divs) if di gagamitin-->
        <!-- Nodes -->
        <!-- <div
          class="relative rounded-full h-6 w-6 bg-green-500 border-green-600 border after:content-['Date'] after:translate-y-6 after:absolute after:bg-gray-600 after:text-white after:px-2 after:py-1 after:rounded-md after:hidden hover:after:block"
        >
          <span class="absolute top-6 text-sm">
            Stage:<br />
            Staff:
          </span>
        </div>
        <div
          class="relative rounded-full h-6 w-6 bg-green-500 border-green-600 border after:content-['Date'] after:translate-y-6 after:absolute after:bg-gray-600 after:text-white after:px-2 after:py-1 after:rounded-md after:hidden hover:after:block"
        >
          <span class="absolute top-6 text-sm">
            Stage:<br />
            Staff:
          </span>
        </div>
        <div
          class="relative rounded-full h-6 w-6 bg-up_maroon border after:content-['Date'] after:translate-y-6 after:absolute after:bg-gray-600 after:text-white after:px-2 after:py-1 after:rounded-md after:hidden hover:after:block"
        >
          <span class="absolute top-6 text-sm">
            Stage:<br />
            Staff:
          </span>
        </div>
        <div
          class="relative rounded-full h-6 w-6 bg-up_maroon border after:content-['Date'] after:translate-y-6 after:absolute after:bg-gray-600 after:text-white after:px-2 after:py-1 after:rounded-md after:hidden hover:after:block"
        >
          <span class="absolute top-6 text-sm">
            Stage:<br />
            Staff:
          </span>
        </div>
        <div
          class="relative rounded-full h-6 w-6 bg-up_maroon border after:content-['Date'] after:translate-y-6 after:absolute after:bg-gray-600 after:text-white after:px-2 after:py-1 after:rounded-md after:hidden hover:after:block"
        >
          <span class="absolute top-6 text-sm">
            Stage:<br />
            Staff:
          </span>
        </div>
        <div
          class="relative rounded-full h-6 w-6 bg-up_maroon border after:content-['Date'] after:translate-y-6 after:absolute after:bg-gray-600 after:text-white after:px-2 after:py-1 after:rounded-md after:hidden hover:after:block"
        >
          <span class="absolute top-6 text-sm">
            Stage:<br />
            Staff:
          </span>
        </div> -->
      </div>
    </div>
    <div>
      <h3 class="text-xl mb-5">Details</h3>
      <div class="h-[146px] w-[650] border bg-white border-none p-6 rounded-md">
        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cum,
          incidunt iste earum ad numquam exercitationem et excepturi est natus
          officiis nostrum unde rem expedita. Voluptatem ratione ea mollitia
          minima quibusdam.
        </p>
      </div>
    </div>
    <div>
      <h3 class="text-xl mb-5">Remarks</h3>
      <div class="h-[146px] w-[650] border bg-white border-none p-6 rounded-md">
        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cum,
          incidunt iste earum ad numquam exercitationem et excepturi est natus
          officiis nostrum unde rem expedita. Voluptatem ratione ea mollitia
          minima quibusdam.
        </p>
      </div>
    </div>
    <div>
      <button class="border py-2 px-4 mr-6 rounded-md bg-[#D9D9D9]"
        >Place holder btn 1</button
      >
      <button class="border py-2 px-4 mr-6 rounded-md bg-[#D9D9D9]"
        >Place holder btn 2</button
      >
    </div>
  </div>
</div>

<style>
</style>
