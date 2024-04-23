import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  console.log(event.params.requestId)

  //todo get Request with requestId
  //todo get RequestType from Request
  //todo send appropriate details to progress view

  return { userInfo: event.locals.user };
};
