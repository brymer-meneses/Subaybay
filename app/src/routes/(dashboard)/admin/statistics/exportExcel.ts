import ExcelJS from "exceljs";
import type { Summary, RequestTypeInstancesCount, RequestType, Request, Params } from "./types";

export async function exportExcel(count: RequestTypeInstancesCount[], summary: Summary[], reqTypes: RequestType[], requests: Request[], params: Params) {
    console.log(requests, reqTypes)
    const workbook = new ExcelJS.Workbook();
    const mainWorksheet = workbook.addWorksheet("Overview");

    mainWorksheet.columns = [
      { header: "Request Type", key: "reqType", width: 50 },
      { header: "Finished", key: "finished", width: 15 },
      { header: "Pending", key: "pending", width: 15 },
      { header: "Stale", key: "stale", width: 15 },
      { header: "Total", key: "total", width: 15 },
    ];

    count.forEach((x) => {
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
      } else if (rowNumber === count.length + 2) {
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

    reqTypes.forEach((reqType: RequestType) => {
      let reqTitle = reqType.title.replace(/[^A-Z0-9]/g, "");
      const worksheet = workbook.addWorksheet(
        reqTitle.length > 0 ? reqTitle : reqType.title,
      );
      worksheet.state = "visible";

      worksheet.columns = [
        { header: "Student Number", key: "number", width: 50 },
        { header: "Student Name", key: "name", width: 30 },
        { header: "Student Email", key: "email", width: 30 },
        { header: "Purpose", key: "purpose", width: 60 },
        { header: "Remarks", key: "remarks", width: 60 },
      ];

      const reqs = requests.filter((req) => {
        return req.requestTypeId === reqType._id;
      });

      reqs.forEach((req) => {
        worksheet.addRow({
          number: req.studentNumber,
          name: req.studentName,
          email: req.studentEmail,
          purpose: req.purpose,
          remarks: req.remarks,
        });
      });

      worksheet.eachRow(function (row, rowNumber) {
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
        } else {
          row.eachCell((cell) => {
            cell.font = {
              color: { argb: "0000" },
              size: 12,
            };
          });
        }
      });
    });

    // Write to a buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Trigger the download
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `ReqStatsReport(${new Date().toDateString().split(" ").splice(1).join(" ")}).xlsx`;
    anchor.click();

    // Cleanup
    window.URL.revokeObjectURL(url);
    anchor.remove();
  }