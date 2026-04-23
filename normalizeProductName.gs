function normalizeCode(code) {
  const match = code.match(/(\d{4})/);
  return match ? "NINA" + match[1] : code;
}
