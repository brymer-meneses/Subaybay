// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import { ExternalToast } from "svelte-sonner";

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      user: import("lucia").User | null;
      session: import("lucia").Session | null;
    }
    interface PageData {
      flash?: {
        type: "success" | "error";
        message: string;
        args?: ExternalToast;
      };
    }
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
