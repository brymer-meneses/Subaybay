<script lang="ts">
  import { Html, Text } from "svelte-email";
  import type { Request } from "$lib/server/database";

  export let request: Request;
  export let requestType: RequestType;
</script>

<Html lang="en">
  <Text>
    Hello {request.studentName}, <br />

    This is to inform you that your request for {requestType.title} has already been
    finished. You may get the request at the OUR office.
  </Text>
</Html>
