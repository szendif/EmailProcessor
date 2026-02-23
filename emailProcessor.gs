function parseOrder(body, email) {
  logDebug("EMAIL BODY (első 500)", body.substring(0, 500));

  const childMatch = body.match(/Gyermek neve:\s*(.+)/i);
  const oviMatch = body.match(/Óvoda.*csoport.*:\s*(.+)/i);
  const fizetesMatch = body.match(/Fizetés módja:\s*(.+)/i);
  const email_ = email;

  if (!childMatch || !oviMatch) {
    logDebug("❌ HIÁNYZÓ ADAT", "Gyerek vagy óvoda/csoport nem található");
    return null;
  }

  const child = childMatch[1].trim();
  const oviCsoport = oviMatch[1].trim();
  const fizetes = fizetesMatch[1].trim();
  
  logDebug("Gyerek", child);
  logDebug("Ovi+Csoport", oviCsoport);
  logDebug("Fizetes", fizetes);

  let ovi = oviCsoport;
  let csoport = "Ismeretlen";

  if (oviCsoport.includes(",")) {
    [ovi, csoport] = oviCsoport.split(",").map(s => s.trim());
  }

  const productRegex =
    /(SZI-\d+)\s*-\s*([^\n]+)\n.*?\n\s*(\d+)\s+([\d\s]+)\s*Ft/gi;

  let items = [];
  let match;

  while ((match = productRegex.exec(body)) !== null) {
    let size = match[2];
    if (match[2].includes(" ")){
      size = (match[2].split(" "))[0];
    }
    items.push({
      gyerek: child,
      kep: match[1],
      meret: size,
      db: Number(match[3]),
      ar: Number(match[4].replace(/\s/g, ""))
    });
  }

  logDebug("Termékek száma", items.length);

  if (items.length === 0) {
    logDebug("❌ NINCS TERMÉK", "Nem található rendelési sor");
    return null;
  }

  return { ovi, csoport, items, fizetes, email };
}
