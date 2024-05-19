import type { LayoutServerLoad } from "./$types";
import { lucia } from "$lib/server/auth";
import { requestType } from "$lib/server/database";

interface HeaderData {
  href: string | undefined,
  content: string
}

export const load: LayoutServerLoad = async (event) => {
  const sessionId = event.cookies.get(lucia.sessionCookieName);

  const routes = event.url.pathname.split('/').filter((s) => s !== "");
  const currentRoute = event.url.pathname.split('/').filter((s) => s !== "").at(0);
  let headerData: Array<HeaderData> = [];

  switch (currentRoute) {
    case "inbox":
      headerData = [
        { href: "/inbox", content: "Inbox" },
        { href: undefined, content: "Manage Recent Tasks" }
      ]
      break;
    case "requests":
      headerData = [
        { href: "/requests", content: "Requests" }
      ]

      if (routes.at(-1) !== "requests") {
        headerData.push({ href: undefined, content: routes.at(-1)! })
      } else {
        headerData.push({ href: undefined, content: "Manage Requests" })
      }
      break;
    case "configuration":
      headerData = [
        { href: "/configuration", content: "Configuration" },
        { href: undefined, content: "Configure Request Type" }
      ]
      if (routes.length > 1) {
        const title = (await requestType.findOne({_id: routes[1]}))?.title;
        if (title){
          headerData.push({ href: undefined, content: title});
        } else {
          headerData.push({ href: undefined, content: "Request Type Does Not Exist"});
        }
      }
      break;
    case "admin":
      headerData = [
        { href: "/admin", content: "Administrator" },
        { href: undefined, content: routes[1]? routes[1][0].toUpperCase()+routes[1].substring(1): "Overview" },
      ]
      
      break;
  }

  // need to put this here since sidebar is in the +layout.svelte in dashboard and
  // it depends on this
  return { userInfo: event.locals.user!, sessionId: sessionId!, headerData };
};
