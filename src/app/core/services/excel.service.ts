import { Injectable } from '@angular/core';
import { MimeTypeEnum } from '@core/enums/mime-type';
import { Workbook } from 'exceljs';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  public async convertExcelToFile( workbook: Workbook, fileName: string): Promise<File> {
    const arrayBuffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([arrayBuffer], { type: MimeTypeEnum.EXCEL });
    return new File([blob], fileName + '.xlsx', { type: MimeTypeEnum.EXCEL });
  }
}
