/** Keep cent amounts numeric while neutralising formulas in user text. */
export function csvCell(value: string | number): string {
  const text =
    typeof value === "number"
      ? String(value)
      : value.replace(/^[\t\r\n ]*[=+@-]/, "'$&");
  return '"' + text.replaceAll('"', '""') + '"';
}
