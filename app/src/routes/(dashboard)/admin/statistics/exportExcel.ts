import ExcelJS from "exceljs";
import type { Summary, RequestTypeInstancesCount, RequestType, Request, Params } from "./types";

const columns = [
  { header: "Student Number", key: "number", width: 50 },
  { header: "Name", key: "name", width: 30 },
  { header: "Email", key: "email", width: 30 },
  { header: "Date Requested", key: "startDate", width: 30 },
  { header: "Date Finished", key: "endDate", width: 30 },
  { header: "Requested Form", key: "reqType", width: 60 },
  { header: "Copies", key: "copies", width: 30 }, 
  { header: "Purpose", key: "purpose", width: 80 },
  { header: "Remarks", key: "remarks", width: 80 },
  
]

export async function exportExcel(countS: RequestTypeInstancesCount[], summarY: Summary[], reqTypes: RequestType[], requests: Request[], params: Params) {
  const workbook = new ExcelJS.Workbook();
  const mainWorksheet = workbook.addWorksheet("Overview");

  mainWorksheet.columns = [
    { header: "Request Type", key: "reqType", width: 50 },
    { header: "Finished", key: "finished", width: 15 },
    { header: "Pending", key: "pending", width: 15 },
    { header: "Stale", key: "stale", width: 15 },
    { header: "Total", key: "total", width: 15 },
  ];
  
  let pending: Request[] = [];
  let finished: Request[] = [];
  let stale: Request[] = [];
  let counts: RequestTypeInstancesCount[] = [];
  let summary: Summary[] = [{type: "finished", count: 0, countThisMonth:0},{type: "pending", count: 0, countThisMonth:0},{type: "stale", count: 0, countThisMonth:0}];
  
  // Separate pending to archived requests
  for (const request of requests) {
    if (!request.isFinished) {
      pending.push(request);
    } else if (request.currentStage.finished) {
      finished.push(request);
    } else {
      stale.push(request);
    }
  }
  
  
  // if has specified date range, filter requests
  if (params.dateRange) { 

    for (const rt of reqTypes) {
      counts.push({ reqTitle: rt.title, total: { pending: 0, finished: 0, stale:0 } });
    }
    counts = Array.from(new Set(counts)); // remove duplicate haha

    finished = finished.filter((r) => {
      let dateFinished = r.currentStage.dateFinished;
      let reqTitle =  reqTypes.find((rt) => rt._id === r.requestTypeId)?.title;
      if (dateFinished.getTime() - params.startDate.getTime() > 0 && params.endDate.getTime() - dateFinished.getTime() > 0) {
        for (let count of counts) {
          if (count.reqTitle === reqTitle) {
            count.total.finished ++;
            summary[0].count++;
            break;
          }
        }
        return r;
      }
    });
  
    pending = pending.filter((r) => { 
    let dateStarted = r.history.length > 0? r.history[0].dateStarted : r.currentStage.dateStarted; 
    let reqTitle =  reqTypes.find((rt) => rt._id === r.requestTypeId)?.title; 
      if (dateStarted.getTime() - params.startDate.getTime() > 0 && params.endDate.getTime() - dateStarted.getTime() > 0) { 
        for (let count of counts) { 
          if (count.reqTitle === reqTitle) { 
            count.total.pending ++; 
            summary[1].count++; 
            break; 
          } 
        } 
        return r; 
      } 
    }); 
    
    stale = stale.filter((r) => {
      let dateStarted = r.history.length > 0? r.history[0].dateStarted : r.currentStage.dateStarted;
      let reqTitle =  reqTypes.find((rt) => rt._id === r.requestTypeId)?.title;
      if (dateStarted.getTime() - params.startDate.getTime() > 0 && params.endDate.getTime() - dateStarted.getTime() > 0) {
        for (let count of counts) {
          if (count.reqTitle === reqTitle) {
            count.total.stale ++;
            summary[2].count++;
            break;
          }
        }
        return r;
      }
    });
  } else {
    counts = countS;
    summary = summarY;
  }
  
  counts.forEach((x) => {
    mainWorksheet.addRow({
      reqType: x.reqTitle,
      finished: x.total.finished,
      pending: x.total.pending,
      stale: x.total.stale,
      total: x.total.finished + x.total.pending + x.total.stale,
    });
  });

  mainWorksheet.addRow({
    reqType: "Total",
    finished: summary[0].count,
    pending: summary[1].count,
    stale: summary[2].count,
    total: summary[0].count + summary[1].count + summary[2].count,
  });

  mainWorksheet.eachRow(function (row, rowNumber) {
    row.height = 20;
    if (rowNumber === 1) {
      row.eachCell((cell) => {
        cell.font = {
          bold: true,
          color: { argb: "0000" },
          size: 14,
        };
        cell.alignment = {
          vertical: "middle",
          horizontal: "center",
        };
      });
    } else if (rowNumber === countS.length + 2) {
      row.eachCell((cell) => {
        cell.font = {
          bold: true,
          color: { argb: "0000" },
          size: 12,
        };
      });
    } else {
      row.eachCell((cell) => {
        cell.font = {
          color: { argb: "0000" },
          size: 12,
        };
      });
    }
  });

  // Sort accorting to params.sortBy and params.sortType
  if (params.sortBy === "date" && params.sortType !== "request") {
    switch (params.sortType) {
      case "oldest": 
        pending.sort(sortPendingOldest);
        finished.sort(sortFinishedOldest);
        stale.sort(sortPendingOldest)
        break;
      case "newest": 
        pending.sort(sortPendingNewest);
        finished.sort(sortFinishedNewest);
        stale.sort(sortPendingNewest)
        break; 
    }
  } else if (params.sortBy === "requestType" && params.sortType === "request") {
    pending.sort((a, b) => {
      const titleA = reqTypes.find((r) => r._id === a.requestTypeId)?.title || '';
      const titleB = reqTypes.find((r) => r._id === b.requestTypeId)?.title || '';
      return titleA.localeCompare(titleB);
    });
    finished.sort((a, b) => {
      const titleA = reqTypes.find((r) => r._id === a.requestTypeId)?.title || '';
      const titleB = reqTypes.find((r) => r._id === b.requestTypeId)?.title || '';
      return titleA.localeCompare(titleB);
    });
    stale.sort((a, b) => {
      const titleA = reqTypes.find((r) => r._id === a.requestTypeId)?.title || '';
      const titleB = reqTypes.find((r) => r._id === b.requestTypeId)?.title || '';
      return titleA.localeCompare(titleB);
    });
  }

  let fws = workbook.addWorksheet("Finished Requests"); 
  fws.state = "visible";
  fws.columns = columns;
  finished.forEach((r) => {
    fws.addRow(
      {
        number: r.studentNumber,
        name: r.studentName,
        email: r.studentEmail,
        startDate: r.history[0].dateStarted,
        endDate: r.currentStage.dateFinished,
        reqType: reqTypes.find((rt) => rt._id === r.requestTypeId)?.title,
        copies: r.copies,
        purpose: r.purpose,
        remarks: r.remarks,
      }
    )
  });
  
  let pws = workbook.addWorksheet("Pending Requests"); // pws = pending worksheet
  pws.state = "visible";
  pws.columns = columns;
  pending.forEach((r) => {
    pws.addRow(
      {
        number: r.studentNumber,
        name: r.studentName,
        email: r.studentEmail,
        startDate: r.history.length > 0? r.history[0].dateStarted: r.currentStage.dateStarted,
        endDate: "Ongoing",
        reqType: reqTypes.find((rt) => rt._id === r.requestTypeId)?.title,
        copies: r.copies,
        purpose: r.purpose,
        remarks: r.remarks,
      }
    )
  });

  let sws = workbook.addWorksheet("Stale Requests"); 
  sws.state = "visible";
  sws.columns = columns;
  stale.forEach((r) => {
    sws.addRow(
      {
        number: r.studentNumber,
        name: r.studentName,
        email: r.studentEmail,
        startDate: r.history.length > 0? r.history[0].dateStarted: r.currentStage.dateStarted,
        endDate: "Discontinued",
        reqType: reqTypes.find((rt) => rt._id === r.requestTypeId)?.title,
        copies: r.copies,
        purpose: r.purpose,
        remarks: r.remarks,
      }
    )
  });

  fws.eachRow(formatRow);
  pws.eachRow(formatRow);
  sws.eachRow(formatRow);

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;

  // FOR THE FILE NAME:
  const sortDate = (params.sortBy === "date")? "sorted_by_date_" + params.sortType + "_first_": "";
  const sortReqType =  (params.sortBy === "requestType")? "sorted_by_requested_form_" : "";
  const start = params.startDate.toDateString().split(" ").splice(1).join(" ");
  const end =  params.endDate.toDateString().split(" ").splice(1).join(" ");
  const dateRange = (params.dateRange)? "from_" + start + "_to_" + end + "_": "";
  const title = "OUR_Requests_" + sortDate + sortReqType + dateRange + "generated_" + new Date().toDateString().split(" ").splice(1).join(" ") + ".xlsx";

  anchor.download = title;
  anchor.click();

  window.URL.revokeObjectURL(url);
  anchor.remove();
}

// Style rows for the pending, finished, stale worksheets (i used excelJS)
function formatRow (row: any, rowNumber: any) {
  row.height = 20;
  if (rowNumber === 1) {
    row.eachCell((cell: any) => {
      cell.font = {
        bold: true,
        color: { argb: "0000" },
        size: 14,
      };
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
      };
    });
  } else {
    row.eachCell((cell: any) => {
      cell.font = {
        color: { argb: "0000" },
        size: 12,
      };
    });
  }
}

const sortPending = (a: Request, b: Request) => {
    let dateA =
      a.history.length > 0
        ? a.history[0].dateStarted.getTime()
        : a.currentStage.dateStarted.getTime();
    let dateB =
      b.history.length > 0
        ? b.history[0].dateStarted.getTime()
        : b.currentStage.dateStarted.getTime();
    return { dateA, dateB };
  };

const sortPendingNewest = (a: Request, b: Request) => {
    const { dateA, dateB } = sortPending(a, b);
    return dateB - dateA;
  };

const sortPendingOldest = (a: Request, b: Request) => {
    const { dateA, dateB } = sortPending(a, b);
    return dateA - dateB;
  };

const sortFinished = (a: Request, b: Request) => {
    const dateA = a.history[a.history.length - 1].dateFinished.getTime();
    const dateB = b.history[b.history.length - 1].dateFinished.getTime();

    return { dateA, dateB };
  };

const sortFinishedNewest = (a: Request, b: Request) => {
    const { dateA, dateB } = sortFinished(a, b);
    return dateB - dateA;
  };

export const sortFinishedOldest = (a: Request, b: Request) => {
    const { dateA, dateB } = sortFinished(a, b);

    return dateA - dateB;
  };

