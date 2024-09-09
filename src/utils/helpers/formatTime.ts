// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\date-fns\esm\index.js
// @ts-ignore
import format from "date-fns\\format\\index.js";
// @ts-ignore


export function formatTime(fmt: string): string {
  try {
    return format(new Date(), fmt);
  } catch (e: unknown) {
    return "format error";
  }
}
