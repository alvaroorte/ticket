import { CodeReportsEnum } from "@core/enums/type-reports";
import { DropdownCommonInterface } from "@core/interfaces/dropdow-common.interface";

export const TYPE_REPORT_DROPDOWN_OPTIONS: DropdownCommonInterface[] = [
  {value: CodeReportsEnum.TOTALS, label: 'Reporte de totales'},
  {value: CodeReportsEnum.SUBCATEGORYTOTALS, label: 'Reporte de promedio de tiempos'},
  {value: CodeReportsEnum.TECHNICIAN, label: 'Reporte de tiempos del técnico'},
  {value: CodeReportsEnum.ALERTS_EVENTS, label: 'Reporte de alertas y eventos'},
] as const;








