function processDigitalOrders() {
  const LABEL_NAME = "ninafotoz-feldolgozva-AN";
  const SUBJECT_QUERY = 'subject:"[NinaFotoz]: Új rendelés "';

  const threads = GmailApp.search(
    `${SUBJECT_QUERY} label:${LABEL_NAME}`
  );

  threads.forEach(thread => {
    const message = thread.getMessages()[0];
    const html = message.getBody();
    const orderEmail = message.getReplyTo();
    const body = htmlToText(html);

    const orderData = parseOrder(body, orderEmail);
    if (!orderData) {
      logDebug("❌ PARSE HIBA", message.getSubject());
      return;
    }

    const digitalItems = orderData.items.filter(i => i.kep.startsWith("PE-"));
    if (digitalItems.length === 0) return;

    const file = saveDigitalToSheet({ ...orderData, items: digitalItems });
    updateSummarySheet(file);
  });
}

function saveDigitalToSheet(data) {
  const fileName = data.oviNormalized + " - Digitális";
  let file = getOrCreateFile(fileName);
  let sheet = file.getSheetByName(data.csoport);

  if (!sheet) {
    const sheets = file.getSheets();
    if (sheets.length === 1 && sheets[0].getLastRow() === 0) {
      sheet = sheets[0];
      sheet.setName(data.csoport);
    } else {
      sheet = file.insertSheet(data.csoport);
    }
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Gyerek neve", "Kép neve", "Darabszám", "Ár"]);
  }

  sheet.appendRow([data.child]);

  let orderTotal = 0;
  data.items.forEach(i => {
    sheet.appendRow(["", i.kep, i.db, i.ar]);
    orderTotal += i.ar;
  });

  sheet.appendRow(["RENDELÉS ÖSSZESEN", "", "", orderTotal, data.fizetes, data.email]);
  sheet.appendRow([" "]);

  return file;
}
