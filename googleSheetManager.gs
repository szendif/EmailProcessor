function saveToSheet(data) {
  //let file = getOrCreateFile(data.ovi);
  //let sheet = file.getSheetByName(data.csoport)
    //|| file.insertSheet(data.csoport);
  let file = getOrCreateFile(data.ovi);

  let sheet = file.getSheetByName(data.csoport);

  let fizetes = data.fizetes;
  let email = data.email;
 
  if (!sheet) {
    const sheets = file.getSheets();

    // ha csak az alap Sheet1 van és üres → átnevezzük
    if (sheets.length === 1 && sheets[0].getLastRow() === 0) {
      sheet = sheets[0];
      sheet.setName(data.csoport);
    } else {
      sheet = file.insertSheet(data.csoport);
    }
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Gyerek neve", "Kép neve", "Méret",
      "Darabszám", "Ár", "Méret összesen"
    ]);
  }

  const totals = {};
  // gyerek neve
  let childName = data.items[0].gyerek;
  
  data.items.forEach(i => {
    const key = i.meret;
    totals[key] = (totals[key] || 0) + i.db;
    childName = i.gyerek;
  });

  sheet.appendRow([childName]);

  let orderTotal = 0;

  // méret szerint csoportosítás
  const grouped = {};

  data.items.forEach(i => {
    grouped[i.meret] = grouped[i.meret] || [];
    grouped[i.meret].push(i);
  });

  SIZE_ORDER.forEach(size => {
  if (!grouped[size]) return;

  let sizeTotal = 0;
  let sizePrice = 0;

  grouped[size].forEach(i => {
    sheet.appendRow(["", i.kep, size, i.db, "", ""]);
    sizeTotal += i.db;
    sizePrice += i.ar;
    orderTotal += i.ar;
  });

  // méretenkánt összesítő sor
  sheet.appendRow(["", "", `${size}`,"", "", sizeTotal, ""]);
});


/*
  data.items.forEach(i => {
    sheet.appendRow([
      "",
      i.kep,
      i.meret,
      i.db,
      i.ar,
      totals[i.meret]
    ]);
    orderTotal += i.ar;
  });
*/

  // total
  sheet.appendRow([
    "RENDELÉS ÖSSZESEN", "", "", "", orderTotal, "", fizetes, email
  ]);

  // üres sor
  sheet.appendRow([" "]);

  return file;
}
