import { PAGE_OFFSET } from "@core/constants/constants";
import { MESSAGES } from "@core/constants/messages";

export function areObjectListsEqual(list1: number[], list2: number[]): boolean {
  if (list1.length !== list2.length) {
    return false;
  }

  const sortedList1 = [...list1].sort((a, b) => a - b);
  const sortedList2 = [...list2].sort((a, b) => a - b);

  return sortedList1.every((obj, index) => isObjectEqual(obj, sortedList2[index]));
}

function isObjectEqual(obj1: number, obj2: number): boolean {
  return obj1 === obj2;
}

export function formatCurrentPageReportTemplate(first: number, totalRecords: number | null | undefined, rows: number, locale = 'es-BO'): string {
  if (!totalRecords) return MESSAGES.emptyMessage;
  const firstRecord = first + PAGE_OFFSET;
  const lastRecord = Math.min(first + rows, totalRecords);
  return `Mostrando ${new Intl.NumberFormat(locale).format(firstRecord)} a ${new Intl.NumberFormat(locale).format(lastRecord)} de ${new Intl.NumberFormat(locale).format(totalRecords)} registros`;
}