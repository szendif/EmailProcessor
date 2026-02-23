function getOrCreateFile(name) {
  const files = DriveApp.getFilesByName(name);
  if (files.hasNext()) return SpreadsheetApp.open(files.next());

  return SpreadsheetApp.create(name);
}
