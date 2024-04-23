<script lang="ts">
  import ProgressView from "./ProgressView.svelte";
  export let data: any;
</script>

<!--TODO add an error page??-->
<ProgressView request={data.request} requestType={data.requestType} users={data.users} />
