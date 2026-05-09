/**
 * Export CSV untuk Excel Windows (locale Indonesia/Eropa):
 * pemisah kolom memakai titik koma (;) karena Excel memakai itu sebagai "List separator"
 * regional — kalau pakai koma, sering seluruh baris masuk 1 kolom.
 */
const SEP = ";"

function csvCell(value: unknown): string {
  const s = value == null ? "" : String(value)
  if (new RegExp(`["\\n\\r${SEP}]`).test(s)) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

export function rowsToCsv(rows: string[][]): string {
  return rows.map((row) => row.map(csvCell).join(SEP)).join("\r\n")
}

export function downloadCsvFile(filename: string, rows: string[][]) {
  const body = "\uFEFF" + rowsToCsv(rows)
  const blob = new Blob([body], { type: "text/csv;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
