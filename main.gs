function processNinaFotozOrders() {
  const LABEL_NAME = "ninafotoz-feldolgozva";
  const SUBJECT_QUERY = 'subject:"[NinaFotoz]: Új rendelés "';

//const threads = GmailApp.search(
  //`${SUBJECT_QUERY} -label:${LABEL_NAME}`
//);

  const SUBJECT = "[NinaFotoz]: Új rendelés #48276";

  const label = GmailApp.getUserLabelByName(LABEL_NAME) 
    || GmailApp.createLabel(LABEL_NAME);

  const threads = GmailApp.search(
    `subject:"${SUBJECT}" -label:${LABEL_NAME}`
  );

  threads.forEach(thread => {
    const message = thread.getMessages()[0];
    const html = message.getBody();
    const orderEmail = message.getReplyTo();
    const body = htmlToText(html);

    //const body = message.getPlainBody();

    // parse
    const orderData = parseOrder(body, orderEmail);

    //save to sheetbe
    const file = saveToSheet(orderData);

    // summary update
    updateSummarySheet(file);

    // mark as processed
    thread.addLabel(label);
  }); 
}
