type CsvValue = string | number | boolean | null | undefined;

export function toCsv(rows: Record<string, CsvValue>[]) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escape = (value: CsvValue) => {
    const normalized = value == null ? "" : String(value);
    return `"${normalized.replaceAll('"', '""')}"`;
  };

  return [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => escape(row[header])).join(",")),
  ].join("\n");
}
