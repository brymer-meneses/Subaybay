import * as db from "$lib/server/database";
import { setFlash } from "sveltekit-flash-message/server";
import type { Actions, PageServerLoad } from "./$types";
import { fail } from "@sveltejs/kit";

export const load: PageServerLoad = async (event) => {
  const allReq = await db.request.find().toArray();
  const activeRequests: db.Request[] = [];
  const finishedRequests: db.Request[] = [];
  const staleRequests: db.Request[] = [];

  for (const request of allReq) {
    if (!request.isFinished) {
      activeRequests.push(request);
    } else if (request.currentStage.finished) {
      finishedRequests.push(request);
    } else {
      staleRequests.push(request);
    }
  }

  return {
    userInfo: event.locals.user,
    activeRequests,
    finishedRequests,
    staleRequests,
  };
};

export const actions: Actions = {
  // todo move out to individual request's page
  edit: async ({ request, cookies }) => {
    const formData = await request.formData();

    let errorMessage = "";
    const requestId: string = formData.get("requestId")?.toString() ?? "";
    const studentName: string = formData.get("studentName")?.toString() ?? "";
    const studentEmail: string = formData.get("studentEmail")?.toString() ?? "";
    const studentNumber: string =
      formData.get("studentNumber")?.toString() ?? "";
    const purpose: string = formData.get("purpose")?.toString() ?? "";
    const remarks: string = formData.get("remarks")?.toString() ?? "";
    const copiesString = formData.get("copies")?.toString() ?? "";
    const copies: number = copiesString.length > 0 ? parseInt(copiesString, 10) : 0;

    if (studentName.length == 0) errorMessage += "Student Name cannot be blank\n";
    if (!isValidStudentNum(studentNumber))
      errorMessage += "Invalid Student Number Format (XXXX-XXXXX)\n";
    if (!isValidStudentEmail(studentEmail))
      errorMessage += "Invalid Student Email\n";
    if (copiesString.length <= 0)
      errorMessage += "Number of Copies cannot be null.\n";

    if (errorMessage != "") {
      setFlash({ type: "error", message: errorMessage }, cookies);
      return fail(400);
    }

    const req = await db.request.findOneAndUpdate(
      { _id: requestId },
      {
        $set: {
          studentName: studentName,
          studentEmail: studentEmail,
          studentNumber: studentNumber,
          purpose: purpose,
          remarks: remarks,
          copies: copies,
        },
      },
    );

    if (!req) {
      setFlash({ type: "error", message: "Database Error: Request update failed" }, cookies);
    }
    else {
      setFlash({ type: "success", message: "Success. Request Details updated" }, cookies);
    }
  },
};

function isValidStudentNum(studentNumber: string) {
  return /^\d{4}-\d{5}$/.test(studentNumber);
}

function isValidStudentEmail(studentEmail: string) {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(studentEmail);
}
