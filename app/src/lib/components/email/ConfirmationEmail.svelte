<script lang="ts">
  import { Html, Text, Img } from "svelte-email";
  import type { Request, RequestType } from "$lib/server/database";

  export let request: Request;
  export let requestType: RequestType;
</script>

<Html lang="en">
  <Text>
    Good day! <br />
    <br />
    Your request for <span style="color:red">{requestType.title}</span> is ready
    for pickup. You may get this personally and present any valid ID and claim
    stub (if applicable) upon claiming it or have it picked up from the OUR by
    your authorized representative with a
    <strong><u>printed and duly signed authorization letter</u></strong>
    and
    <strong
      ><u>photocopies of your valid ID and your representative's ID</u></strong
    >. <br />
    <br />
    <strong>If the above is not possible</strong>, you may ask a courier service
    provider (e.g., ERS courier Services, Errand Runner Service, Food Ninja, JRS
    Express Ltd., ABest Courier Service, or DHL for international service) to
    pick this up from the office, Send us a duly signed authorization letter
    authorizing the errand service or courier to pick it up and a scanned copy
    of your valid ID. <br />
    <br />
    Please note that we are not accomodating e-copies of any certifications. You
    may pick this up in the office. <br />
    <br />
    Please be informed that documents that go unclaimed within
    <strong>6 months of their availability</strong>
    will be shredded in order to protect your personal information. <br />
    <br />
    Kindly bring your own long envelopes or any document container since these are
    not provided by the office. <br />
    <br />
    <br />
    Thank you,<br />
    <br />
    <br />
    <strong>Assoc. Prof. Victoria Lourdes C. Diaz</strong><br />
    University Registrar <br />
    UP Baguio <br />
    Gov. Pack Rd., Baguio City 2600 <br />
    Tel. (074) 442 5592 <br />
    <br />
    <br />
    <strong
      >Please help us improve our services! Fill out our Client Satisfaction
      Measurement Form: <a href="https://tinyurl.com/upb-csm" target="_blank"
        >CSM</a
      > or scan this QR code:
    </strong><br />
    <br />
    <Img src="cid:qrcode" alt="CSM QR Code" width="294" height="420" />
  </Text>
</Html>
