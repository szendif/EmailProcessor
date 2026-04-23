function normalizeCode(code) {
  if (/^pe-\d+/i.test(code)) {
    return "PE-" + code.match(/(\d+)/)[1];
  }
  const match = code.match(/(\d{4})/);
  return match ? "NINA" + match[1] : code;
}
