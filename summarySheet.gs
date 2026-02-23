function updateSummarySheet(spreadsheet) {
  let summary = spreadsheet.getSheetByName("ÖSSZESÍTÉS")
    || spreadsheet.insertSheet("ÖSSZESÍTÉS");

  summary.clear();
  summary.appendRow(["Csoport", "Összeg (Ft)", "10%"]);

  let totalAll = 0;

  spreadsheet.getSheets().forEach(sheet => {
    if (sheet.getName() === "ÖSSZESÍTÉS") return;

    const values = sheet.getDataRange().getValues();
    let groupTotal = 0;

    values.forEach(row => {
      if (row[0] === "RENDELÉS ÖSSZESEN") {
        groupTotal += Number(row[4]) || 0;
      }
    });

    let tenPercent = 0;
    if (groupTotal > 0){
      tenPercent = groupTotal * 10 / 100;
    } 
    summary.appendRow([sheet.getName(), groupTotal, tenPercent]);
    totalAll += groupTotal;
  });


  let totalTenPercent = 0;
  if (totalAll > 0){
      totalTenPercent = totalAll * 10 / 100;
    } 
  summary.appendRow([" "]);
  summary.appendRow([" "]);
  summary.appendRow([" "]);
  summary.appendRow(["Összesn", totalAll, totalTenPercent]);
}
