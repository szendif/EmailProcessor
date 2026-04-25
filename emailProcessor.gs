function parseOrder(body, email) {
  logDebug("EMAIL BODY (első 500)", body.substring(0, 500));
/*
  const childMatch = body.match(/Gyermek neve:\s*(.+)/i);
  const oviMatch = body.match(/Óvoda.*csoport.*:\s*(.+)/i);
  const fizetesMatch = body.match(/Fizetés módja:\s*(.+)/i);

  const childMatch = body.match(/Gyermek neve:\s*([^\n\r]+)/i);
  const oviMatch = body.match(/Óvoda neve:\s*([^\n\r]+)/i);
  const csoportMatch = body.match(/Csoport neve:\s*([^\n\r]+)/i);
  const fizetesMatch = body.match(/Fizetés módja:\s*([^\n\r]+)/i);
  const email_ = email;

  if (!childMatch || !oviMatch) {
    logDebug("❌ HIÁNYZÓ ADAT", "Gyerek vagy óvoda/csoport nem található");
    return null;
  }

  const child = childMatch[1].trim();
  const oviCsoport = oviMatch[1].trim();
  const fizetes = fizetesMatch[1].trim();

  // biztonságos kiolvasás (ha nincs találat, ne dobjon hibát)
  const child = childMatch ? childMatch[1].trim() : "";
  const ovi = oviMatch ? oviMatch[1].trim() : "";
  const csoport = csoportMatch ? csoportMatch[1].trim() : "";
  const fizetes = fizetesMatch ? fizetesMatch[1].trim() : "";
*/
  body = body
  .replace(/(Gyermek neve:|Óvoda neve:|Csoport neve:|Fizetés módja:|Hozzájárulok[^:]*:)/g, '\n$1')
  .replace(/\n+/g, '\n');;

  const childMatch = body.match(/Gyermek neve:\s*([^\n]+)/i);
  const oviMatch = body.match(/Óvoda neve:\s*([^\n]+)/i);
  const csoportMatch = body.match(/Csoport neve:\s*([^\n]+)/i);
  const fizetesMatch = body.match(/Fizetés módja:\s*([^\n]+)/i);

  const child = childMatch ? childMatch[1].trim() : "";
  const ovi = oviMatch ? oviMatch[1].trim() : "";
  const csoport_ = csoportMatch ? csoportMatch[1].trim() : "";
  const fizetes = fizetesMatch ? fizetesMatch[1].trim() : "";

  const OVI_MAP = {
  "szent imre": "Szent Imre Óvoda",
  "szent imre ovoda": "Szent Imre Óvoda",
  "szent imre ovi": "Szent Imre Óvoda",
  "szent imre komárom": "Szent Imre Óvoda",
  "szent imre ált isk": "Szent Imre Óvoda",
  "st": "Szent Imre Óvoda",
  "Szent Imre Római Katolikus Általános Iskola és Óvoda, Komárom" : "Szent Imre Óvoda",
  "Szent Imre Óvoda, Komárom" : "Szent Imre Óvoda",
  "Szent Imre Komárom" : "Szent Imre Óvoda",
  "Szent Imre Római Katolikus Általános Iskola és Óvoda Komárom" : "Szent Imre Óvoda",
  "Szent Imre Katolikus Óvoda Komárom" : "Szent Imre Óvoda",
  "Szt. Imre Róm. Kat. Óvoda, Komárom" : "Szent Imre Óvoda",
  "Szent Imre Római Katolikus Által. Isk. és Óvoda" : "Szent Imre Óvoda",
  "Szent Imre óvoda Komárom" : "Szent Imre Óvoda",
  "Szent Imre" : "Szent Imre Óvoda",
  "Szent Imre Római Katolikus Általános Iskola és Óvoda" : "Szent Imre Óvoda",
  "Szent Imre Óvoda" : "Szent Imre Óvoda", 
  "Komárom Szent Imre Óvoda és Iskola" : "Szent Imre Óvoda",
  "Szent Imre" : "Szent Imre Óvoda",
  "Bóbita ovoda Ács" : "Bóbita Óvoda",
  "Bóbita" : "Bóbita Óvoda",
  "Ácsi Bóbita Óvoda" : "Bóbita Óvoda",
  "Bóbita Óvoda" : "Bóbita Óvoda",
  "bobita" : "Bóbita Óvoda",
  "Ács Bóbita" : "Bóbita Óvoda",
  "Ács Bobita" : "Bóbita Óvoda",
  "Bóbita ovoda Ács" : "Bóbita Óvoda",
  "Ácsi Bóbita Óvoda" : "Bóbita Óvoda",
  "Ács Bóbita Óvoda" : "Bóbita Óvoda",
  "Ács Bóbita ovoda" : "Bóbita Óvoda",
  "Ácsi Bóbita Óvoda" : "Bóbita Óvoda",
  "Bóbita ovoda Ács" : "Bóbita Óvoda",
  "Kinizsi óvoda" : "Pénzásási Óvoda",
  "Kinizsi" : "Pénzásási Óvoda",
  "Pénzi" : "Pénzásási Óvoda",
  "Kertvárosi Bölcsöde" : "Kertvárosi Bölcsöde",
  "Kertvárosi Bölcsőde" : "Kertvárosi Bölcsöde",
  "Kertvárosi Bölcsi": "Kertvárosi Bölcsöde",
  "Kertvarosi Bölcsi": "Kertvárosi Bölcsöde",
  "Gyermekkert Óvoda" : "Gyermekkert Óvoda",
  "Gyermekkert ovoda" : "Gyermekkert Óvoda",
  "Gyermekkert" : "Gyermekkert Óvoda",
  };

let oviFinal = ovi;

if (/imre/i.test(ovi)) {
  oviFinal = "Szent Imre Óvoda";
}
else if (/Imre/i.test(ovi)) {
  oviFinal = "Szent Imre Óvoda";
}
else if (/bóbita/i.test(ovi)) {
  oviFinal = "Bóbita Óvoda";
}
else if (/bobita/i.test(ovi)) {
  oviFinal = "Bóbita Óvoda";
}
else if (/Bóbita/i.test(ovi)) {
  oviFinal = "Bóbita Óvoda";
}
else if (/Bobita/i.test(ovi)) {
  oviFinal = "Bóbita Óvoda";
}
else if (/kertvárosi/i.test(ovi)) {
  oviFinal = "Kertvárosi Óvoda";
}
else if (/kertvarosi/i.test(ovi)) {
  oviFinal = "Kertvárosi Óvoda";
}
else if (/Gyermekkert/i.test(ovi)) {
  oviFinal = "Gyermekkert Óvoda";
}
else if (/kinizsi/i.test(ovi)) {
  oviFinal = "Pénzásási Óvoda";
}
else if (/Kinizsi/i.test(ovi)) {
  oviFinal = "Pénzásási Óvoda";
}
else if (/Pénz/i.test(ovi)) {
  oviFinal = "Pénzásási Óvoda";
}

  const oviClean = ovi.toLowerCase().trim();
  const oviNormalized = OVI_MAP[oviClean] || oviFinal; // ha nincs a mapben, marad az eredeti

  let cleaned = csoport_
    .replace(/\bcsoport\b/gi, '')
    .replace(/\bcs.\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (/Lilliom/i.test(cleaned)) {
    cleaned = "Liliom";
  }
  else if (/Liliom/i.test(cleaned)) {
    cleaned = "Liliom";
  }
  else if (/nap/i.test(cleaned)) {
    cleaned = "Napocska";
  }
  else if (/nap/i.test(cleaned)) {
    cleaned = "Napocska";
  }
  else if (/kati/i.test(cleaned)) {
    cleaned = "Katica";
  }
  else if (/Nyuszi/i.test(cleaned)) {
    cleaned = "Nyuszi";
  }



  const csoport = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);


  logDebug("Gyerek", child);
  logDebug("Ovi", oviNormalized);
  logDebug("Csoport", csoport);
  logDebug("Fizetes", fizetes);

  //let ovi = oviCsoport;
  //let csoport = "Ismeretlen";
/*
  if (oviCsoport.includes(",")) {
    [ovi, csoport] = oviCsoport.split(",").map(s => s.trim());
  }

  const productRegex =
    /(NINA-\d+)\s*-\s*([^\n]+)\n.*?\n\s*(\d+)\s+([\d\s]+)\s*Ft/gi;

  let items = [];
  //let match;

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
*/

const lines = body
  .split('\n')
  .map(l => l.trim())
  .filter(l => l.length > 0);

let items = [];

//const regexpPattern = /(?:csoportk[eé]p\d+(?:-\d+)?)|(?:[a-z]{1,}-?\d{3,5}(?:-\d+)?))\s*;
const productLineRegex = /((?:csoportk[eé]p\d+(?:-\d+)?)|(?:[a-z]{1,}-?\d{3,5}(?:-\d+)?))\s*-\s*([^(]+)\s*Ft/i;
const productRegex = /((?:csoportk[eé]p\d+(?:-\d+)?)|(?:[a-z]{1,}-?\d{3,5}(?:-\d+)?))\s*-\s*([^(]+)\s*\(#/i;
//const productRegex = /((?:csoportk[eé]p\d+(?:-\d+)?)|(?:[a-z]{1,}-?\d{3,5}(?:-\d+)?))\s*\(#/i;


for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  //const testLIne =  test(line);

  // termék sor felismerése
  if (productRegex.test(line)) {
    const productLine = line;
    const dbLine = lines[i + 1];
    const arLine = lines[i + 2];

    if (!dbLine || !arLine) continue;

    const db = Number(dbLine.replace(/\D/g, ''));
    const ar = Number(arLine.replace(/\D/g, ''));

    //const productRegex = /((?:csoportk[eé]p\d+(?:-\d+)?)|(?:[a-z]{1,}-?\d{3,5}(?:-\d+)?))\s*\(#/i;

    const productMatch = line.match(productRegex);
    //(/^([A-Z]+\d+)\s*-\s*(.+?)\s*\(#/);
    if (!productMatch) continue;

    const kep = normalizeCode(productMatch[1]);
    const meretRaw = productMatch[2].trim();

    const meret = meretRaw.toLowerCase().includes("digit")
      ? "Digitálisan"
      : SIZE_ORDER.find(size => meretRaw.includes(size)) || meretRaw;

    items.push({
      gyerek: child,
      kep: kep,
      meret: meret,
      db: db,
      ar: ar
    });

    // ugrunk 2-t, mert már feldolgoztuk
    i += 2;
  }
}

  logDebug("Termékek száma", items.length);

  if (items.length === 0) {
    logDebug("❌ NINCS TERMÉK", "Nem található rendelési sor");
    //return null;
  }

  return { oviNormalized, csoport, child, items, fizetes, email };
}
