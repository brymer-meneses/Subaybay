<script lang="ts">
  import { onMount } from "svelte";
  import { initializeApp, type FirebaseApp } from "firebase/app";
  import { firebaseConfig } from "$lib/firebase";

  import {
    GoogleAuthProvider,
    initializeAuth,
    type Auth,
    browserSessionPersistence,
    browserPopupRedirectResolver,
    signInWithRedirect,
    getRedirectResult,
  } from "firebase/auth";

  import UP from "$lib/assets/UP.png";
  import { goto } from "$app/navigation";

  let app: FirebaseApp;
  let auth: Auth;

  onMount(async () => {
    app = initializeApp(firebaseConfig);
    auth = initializeAuth(app, {
      persistence: browserSessionPersistence,
      popupRedirectResolver: browserPopupRedirectResolver,
    });

    const result = await getRedirectResult(auth, browserPopupRedirectResolver);
    if (result) {
      const idToken = await result.user.getIdToken();

      const response = await fetch("api/sessionLogin", {
        method: "POST",
        body: JSON.stringify({ idToken }),
        headers: {
          "content-type": "application/json",
        },
      });

      const { url, redirected } = response;
      if (redirected) {
        goto(url);
      }
    }
  });

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();

    await signInWithRedirect(auth, provider);
  }
</script>

<div
  class="flex lg:flex-row flex-col items-center justify-center gap-28 w-screen h-screen"
>
  <div class="relative">
    <img src={UP} alt="up-logo" class="w-[500px] absolute z-20" />

    <div
      class="rounded-full bg-red-500 blur-[200px] aspect-square w-[400px] z-0 absolute top-10 bottom-20 left-40 animate-pulse transition"
    />
    <div
      class="rounded-full bg-green-500 blur-[200px] aspect-square w-[400px] z-10 left-5 animate-pulse delayed-start"
    />
  </div>

  <div class="flex flex-col gap-6 z-30">
    <h1
      class="text-8xl font-extrabold font-poppins text-up_maroon text-center lg:text-left"
    >
      Subaybay
    </h1>
    <h2 class="text-4xl font-inter font-thin text-center lg:text-left">
      Request Monitoring System
    </h2>

    <button
      class="flex flex-row justify-center items-center gap-4 bg-white h-full p-4 z-20 rounded-lg drop-shadow-sm hover:bg-slate-100 w-full lg:w-64"
      on:click={async () => await signInWithGoogle()}
    >
      <img src="google.png" alt="google logo" class="w-10" />
      <p class="font-inter font-normal">Sign in with Google</p>
    </button>
  </div>
</div>

<style>
  .delayed-start {
    animation-delay: 0.5s;
  }
</style>
