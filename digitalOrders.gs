function processDigitalOrders() {
  const PROCESSED_LABEL = "ninafotoz-feldolgozva-AN";
  const DIGI_LABEL = "feldolgozva-digi";
  const SUBJECT_QUERY = 'subject:"[NinaFotoz]: Új rendelés "';
  const BATCH_SIZE = 50;

  const digiLabel = GmailApp.getUserLabelByName(DIGI_LABEL)
    || GmailApp.createLabel(DIGI_LABEL);

  const threads = GmailApp.search(
    `${SUBJECT_QUERY} label:${PROCESSED_LABEL} -label:${DIGI_LABEL}`,
    0,
    BATCH_SIZE
  );

  // fileCache[fileName][sheetName] = rows[]
  const fileCache = {};
  const processedThreads = [];

  threads.forEach(thread => {
    const message = thread.getMessages()[0];
    const html = message.getBody();
    const orderEmail = message.getReplyTo();
    const body = htmlToText(html);

    const orderData = parseOrder(body, orderEmail);
    if (!orderData) {
      logDebug("❌ PARSE HIBA", message.getSubject());
      processedThreads.push(thread);
      return;
    }

    const digitalItems = orderData.items.filter(i => i.kep.startsWith("PE-"));

    if (digitalItems.length > 0) {
      const fileName = orderData.oviNormalized + " - Digitális";
      if (!fileCache[fileName]) fileCache[fileName] = {};
      if (!fileCache[fileName][orderData.csoport]) fileCache[fileName][orderData.csoport] = [];

      const rows = fileCache[fileName][orderData.csoport];
      let orderTotal = 0;

      // col layout (8 col): 0=gyerek, 1=kep, 2=db, 3=ar, 4=összesen, 5="", 6=fizetes, 7=email
      rows.push([orderData.child, "", "", "", "", "", "", ""]);
      digitalItems.forEach(i => {
        rows.push(["", i.kep, i.db, i.ar, "", "", "", ""]);
        orderTotal += i.ar;
      });
      // col 4 = orderTotal → updateSummarySheet row[4] ezt olvassa
      rows.push(["RENDELÉS ÖSSZESEN", "", "", "", orderTotal, "", orderData.fizetes, orderData.email]);
      rows.push([" ", "", "", "", "", "", "", ""]);
    }

    processedThreads.push(thread);
  });

  // Batch write: sheeten ként egyetlen setValues() hívás
  const COLS = 8;
  Object.entries(fileCache).forEach(([fileName, sheets]) => {
    const file = getOrCreateFile(fileName);

    Object.entries(sheets).forEach(([sheetName, rows]) => {
      let sheet = file.getSheetByName(sheetName);
      if (!sheet) {
        const existing = file.getSheets();
        if (existing.length === 1 && existing[0].getLastRow() === 0) {
          sheet = existing[0];
          sheet.setName(sheetName);
        } else {
          sheet = file.insertSheet(sheetName);
        }
      }

      if (sheet.getLastRow() === 0) {
        sheet.getRange(1, 1, 1, COLS).setValues(
          [["Gyerek neve", "Kép neve", "Darabszám", "Ár", "", "", "", ""]]
        );
      }

      const startRow = sheet.getLastRow() + 1;
      sheet.getRange(startRow, 1, rows.length, COLS).setValues(rows);
    });

    updateSummarySheet(file);
  });

  // Label hozzáadása csak sikeres írás után — ha timeout jön, a következő futtatás folytatja
  processedThreads.forEach(thread => thread.addLabel(digiLabel));

  logDebug("✅ Feldolgozva", `${processedThreads.length} levél ebben a futtatásban`);
}
