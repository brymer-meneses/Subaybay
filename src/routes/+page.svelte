<script lang="ts">
  import UP from "$lib/assets/UP.png";
  import { goto } from "$app/navigation";
  import { user } from "$lib/user";

  import { initializeApp, type FirebaseApp } from "firebase/app";
  import {
    GoogleAuthProvider,
    initializeAuth,
    type Auth,
    browserSessionPersistence,
    browserPopupRedirectResolver,
    signInWithRedirect,
    onAuthStateChanged,
  } from "firebase/auth";

  import { onMount } from "svelte";

  let app: FirebaseApp;
  let auth: Auth;

  onMount(() => {
    app = initializeApp({
      apiKey: "AIzaSyCW20RAbSKnFkNh5IW0WeTgZlOavP-UwGA",
      authDomain: "subaybay-60d3d.firebaseapp.com",
      projectId: "subaybay-60d3d",
      storageBucket: "subaybay-60d3d.appspot.com",
      messagingSenderId: "346811377701",
      appId: "1:346811377701:web:7acd81c9d273edfe7c37cc",
    });
    auth = initializeAuth(app, {
      persistence: browserSessionPersistence,
      popupRedirectResolver: browserPopupRedirectResolver,
    });

    onAuthStateChanged(auth, (loggedInUser) => {
      if (loggedInUser) {
        $user = loggedInUser!;
        goto("/dashboard");
      }
    });
  });

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider);
  }
</script>

<div class="flex flex-row items-center justify-center gap-28 w-screen h-screen">
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
    <h1 class="text-8xl font-extrabold font-poppins text-up_maroon">
      Subaybay
    </h1>
    <h2 class="text-4xl font-inter font-thin text-up_maroon">
      Request Monitoring System
    </h2>

    <button
      class="flex flex-row justify-center items-center gap-4 w-64 bg-white h-full p-4 z-20 rounded-lg drop-shadow-sm hover:bg-slate-100"
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
