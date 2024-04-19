import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (event) => {
  // need to put this here since sidebar is in the +layout.svelte in dashboard and
  // it depends on this
  return { userInfo: event.locals.user };
};
