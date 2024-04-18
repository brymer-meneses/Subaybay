<script lang="ts">
  import RequestConfig from "$lib/components/request-config/requestConfig.svelte";
  export let data;

</script>

<RequestConfig dbUsers={data.allUsers}/>
