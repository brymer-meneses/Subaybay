<script lang="ts">
  import ExcelJS from "exceljs";

  import { goto } from "$app/navigation";

  import * as Card from "$lib/components/ui/card/index";
  import Button from "$lib/components/ui/button/button.svelte";
  import Input from "$lib/components/ui/input/input.svelte";

  import RequestsSummaryTable from "./RequestsSummaryTable.svelte";

  import Download from "lucide-svelte/icons/download";
  import Plus from "lucide-svelte/icons/plus";
  import Search from "lucide-svelte/icons/search";

  export let count: RequestTypeInstancesCount[];
  export let summary: summary[];
  export let requests: OURRequest[];
  export let reqTypes: RequestType[];

  let searchTerm: string = "";
  let filteredReqTypes: RequestTypeInstancesCount[] = [];

  $: {
    filteredReqTypes = count.filter((reqType: RequestTypeInstancesCount) => {
      if (
        reqType.reqTitle
          .toLowerCase()
          .includes(searchTerm.trim().toLowerCase()) ||
        reqType.reqType.toLowerCase().includes(searchTerm.trim().toLowerCase())
      ) {
        return reqType;
      }
    });
  }

  async function exportExcel() {
    const workbook = new ExcelJS.Workbook();
    const mainWorksheet = workbook.addWorksheet("Request Types Statistics");

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
      const worksheet = workbook.addWorksheet(reqType._id);
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
</script>

<Card.Root>
  <Card.Header
    class="flex flex-col border align-middle md:flex-row md:items-center md:justify-between"
  >
    <Card.Title class="text-xl font-bold">Requst Types Statistics</Card.Title>
    <div class="flex flex-row items-center space-x-4 space-y-0 align-middle">
      <div class="relative w-80">
        <Search
          class="text-muted-foreground absolute left-2.5 top-2.5 h-4 w-4"
        />
        <Input
          type="search"
          placeholder="Search Request Types..."
          class="bg-background w-full rounded-lg pl-8"
          bind:value={searchTerm}
        />
      </div>
      <div class="w-36">
        <Button
          on:click={() => {
            goto("../configuration");
          }}><Plus size="20" />Request Type</Button
        >
      </div>
    </div>
  </Card.Header>
  <Card.Content>
    <RequestsSummaryTable count={filteredReqTypes} />
  </Card.Content>
  <Card.Footer class="">
    <Button variant="outline" class="gap-2" on:click={() => exportExcel()}>
      <Download class="text-muted-foreground h-6 w-6" />
      Report
    </Button>
  </Card.Footer>
</Card.Root>
