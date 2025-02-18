import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DataCommon } from '@core/models/FieldsCommons';
import { QueryMaster, LisInformationSystem } from '@core/models/Report';
import * as ExcelJS from 'exceljs';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  titulo ='REPORTE DE ATENCIÓN DE TICKETS';
  filtro1='EMPRESA:';
  filtro2='CATEGORÍA:';
  filtro3='TIPO DE TICKETS:';
  filtro4='FECHA DESDE:';
  filtro5='FECHA HASTA:';
  titulo6 ='REPORTE GENERAL DETALLADO';

  titulo2 = 'REPORTE CONSOLIDADO';
  titulo3 = 'ATENCIÓN DE TICKETS POR CATEGORÍA';
  titulo4 = 'REPORTE DE TICKETS POR TIPO DE TICKET';

  private addCommonFilters(sheet: ExcelJS.Worksheet, formReport: FormGroup, enterprises: string[], categories: string[]) {
 //filtros
 sheet.mergeCells('A3');
 sheet.getCell('A3').value = this.filtro4;
 sheet.getCell('A3').alignment = { vertical: 'middle' };
 sheet.getCell('A3').font = { size: 12, bold: true };

 sheet.mergeCells('B3');
 sheet.getCell('B3').value = formReport.value.initialDate;
 sheet.getCell('B3').alignment = { vertical: 'middle',horizontal:'left'  };
 sheet.getCell('B3').font = { size: 12};

 sheet.mergeCells('C3');
 sheet.getCell('C3').value = this.filtro5;
 sheet.getCell('C3').alignment = { vertical: 'middle' };
 sheet.getCell('C3').font = { size: 12, bold: true };

 sheet.mergeCells('D3');
 sheet.getCell('D3').value = formReport.value.endDate;
 sheet.getCell('D3').alignment = { vertical: 'middle',horizontal:'left' };
 sheet.getCell('D3').font = { size: 12 };

 sheet.mergeCells('A4');
 sheet.getCell('A4').value = this.filtro1;
 sheet.getCell('A4').alignment = { vertical: 'middle' };
 sheet.getCell('A4').font = { size: 12, bold: true };

 sheet.mergeCells('B4');
 sheet.getCell('B4').value = enterprises.join(', ');
 sheet.getCell('B4').alignment = { vertical: 'middle' };
 sheet.getCell('B4').font = { size: 12};

 sheet.mergeCells('A5');
 sheet.getCell('A5').value = this.filtro2;
 sheet.getCell('A5').alignment = { vertical: 'middle' };
 sheet.getCell('A5').font = { size: 12, bold: true };

 sheet.mergeCells('B5');
 sheet.getCell('B5').value = categories.join(', ');
 sheet.getCell('B5').alignment = { vertical: 'middle' };
 sheet.getCell('B5').font = { size: 12};

 sheet.mergeCells('C4');
 sheet.getCell('C4').value = this.filtro3;
 sheet.getCell('C4').alignment = { vertical: 'middle' };
 sheet.getCell('C4').font = { size: 12, bold: true };

 sheet.mergeCells('D4');
 sheet.getCell('D4').value = (formReport.value.tipoTicket)? formReport.value.tipoTicket.join(', '): '';
 sheet.getCell('D4').alignment = { vertical: 'middle' };
 sheet.getCell('D4').font = { size: 12 };

}



  async downloadExcel(datos: LisInformationSystem, formReport: FormGroup, enterprises: string[], categories: string[]) {

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('INFORME TÉCNICO');
    this.addCommonFilters(sheet, formReport, enterprises, categories);
    sheet.mergeCells('A1:D1');
    sheet.getCell('A1').value = this.titulo;
    sheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
    sheet.getCell('A1').font = { size: 16, bold: true };

    sheet.mergeCells('A7:A7');
    sheet.getCell('A7').value = this.titulo2;
    sheet.getCell('A7').alignment = { vertical: 'middle' };
    sheet.getCell('A7').font = { size: 12, bold: true };

    const sheet2 = workbook.addWorksheet('REPORTE GENERAL DETALLADO');
    this.addCommonFilters(sheet2, formReport, enterprises, categories);
    sheet2.mergeCells('A1:D1');
    sheet2.getCell('A1').value = this.titulo6;
    sheet2.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
    sheet2.getCell('A1').font = { size: 16, bold: true };

    let rowsConsolidatedReport = this.getQueryMasterConsolidatedReport(datos.queryMaster);
    let rowsTotalConsolidatedeReport= this.getQueryMasterTotalConsolidatedeReport(datos.queryMaster);
    let rowsQueryMaster = this.getQueryMaster(datos.queryMaster);
    let rowsQueryMasterDetail = this.getQueryMasterDetail(datos.queryMaster);


    if (rowsConsolidatedReport.length > 0) {

      sheet.addTable({
        name: 'tabla1',
        ref: 'A9',
        headerRow: true,
        totalsRow: false,
        style: {
          theme: 'TableStyleLight9',
          showRowStripes: true,
        },
        columns: [
          { name: 'CATEGORÍA', filterButton: true },
          { name: 'CANTIDAD', filterButton: true },
          { name: 'PORCENTAJE', filterButton: true },
          { name: 'TIEMPO PROMEDIO EN HRS.', filterButton: true },
        ],
        rows: rowsConsolidatedReport,
      });

     for (let i = 10; i <= rowsConsolidatedReport.length + 9; i++) {
      for (let j = 2; j <= 4; j++) {
        sheet.getCell(i, j).alignment = { horizontal: 'right' };
      }
    }

    sheet.getRow(9).eachCell((cell: any) => {
      cell.alignment = { horizontal: 'center' };
      });

    }
    let currentRow: number = 11 + rowsConsolidatedReport.length;


    //TOTALES
    if (rowsTotalConsolidatedeReport.rows.length > 0) {
      const headersCap = rowsTotalConsolidatedeReport.headers.map(header => ('TOTAL '+ header.name).toUpperCase());

      sheet.addTable({
        name: 'tabla2',
        ref: 'A' + currentRow,
        headerRow: true,
        totalsRow: false,
        style: {
          theme: 'TableStyleLight9',
          showRowStripes: true,
        },
        columns: headersCap.map(name => ({ name, filterButton: true })),
        rows: rowsTotalConsolidatedeReport.rows,
      });

      sheet.getRow(currentRow).eachCell((cell: any) => {
        cell.alignment = { horizontal: 'center' };
      });

      currentRow += rowsTotalConsolidatedeReport.rows.length + 4;
    }


    sheet.mergeCells(`A${currentRow}:A${currentRow}`);
    sheet.getCell('A' + currentRow).value = this.titulo3;
    sheet.getCell('A' + currentRow).alignment = { vertical: 'middle' };
    sheet.getCell('A' + currentRow).font = { size: 12, bold: true };
    currentRow += 2; //espacio entre primeras 2 tablas y tablas de categorias


    //CODIGO ROMA   CATEGORY
    let categoryVector:string[]=[];

    if (rowsQueryMaster.length > 0) {
      rowsQueryMaster.forEach((dato:any)=>{
        let resultado = categoryVector.find(elemento => elemento === dato[0]);
        if(resultado==undefined){
          categoryVector.push(dato[0]);
        }
      });
    }


    for (let i=0;i<=categoryVector.length;i++){
      let rowsQueryMasterCategory = this.getQueryMasterCategory(datos.queryMaster,categoryVector[i]);
      if (rowsQueryMasterCategory.length > 0) {

        sheet.getCell('A'+currentRow).value = categoryVector[i].toString();
        sheet.getCell('A'+currentRow).font = { size: 12, bold: true };
        currentRow++;

        sheet.addTable({
          name: 'tabla3'+ currentRow,
          ref: 'A' + currentRow,
          headerRow: true,
          totalsRow: false,
          style: {
            theme: 'TableStyleLight9',
            showRowStripes: true,
          },
          columns: [
            { name: 'NRO.', filterButton: true },
            { name: 'CÓDIGO', filterButton: true },
            { name: 'TÍTULO', filterButton: true},
            { name: 'CATEGORÍA', filterButton: true },
            { name: 'SUBCATEGORÍA', filterButton: true },
            { name: 'ESTADO', filterButton: true },
            { name: 'FECHA CREACIÓN', filterButton: true },
            { name: 'FECHA CIERRE', filterButton: true },
            { name: 'TIPO TICKET', filterButton: true },
            { name: 'SOLICITANTE', filterButton: true },
            { name: 'TÉCNICO', filterButton: true },
            { name: 'HORAS', filterButton: true },
            { name: 'OBSERVACIÓN', filterButton: true },
          ],
          rows: rowsQueryMasterCategory,
        });


        for (let j = currentRow; j < currentRow + rowsQueryMasterCategory.length +1; j++) {
          sheet.getRow(j).getCell(7).alignment = { horizontal: 'right' };
          sheet.getRow(j).getCell(8).alignment = { horizontal: 'right' };
          sheet.getRow(j).getCell(12).alignment = { horizontal: 'right' };
          sheet.getRow(j).getCell(13).alignment = { horizontal: 'right' };

        }

        sheet.getRow(currentRow).eachCell((cell: any) => {
          cell.alignment = { horizontal: 'center' };
          });

        currentRow += rowsQueryMasterCategory.length + 2;
      }
      }

currentRow += 2; //espacio entre categoria y tipo de ticket


 //CODIGO ROMA TYPE TICKET 15-01-2023
 sheet.mergeCells(`A${currentRow}:A${currentRow}`);
 sheet.getCell('A' + currentRow).value = this.titulo4;
 sheet.getCell('A' + currentRow).alignment = { vertical: 'middle' };
 sheet.getCell('A' + currentRow).font = { size: 12, bold: true };


 currentRow ++;

   let typeTicketVector:String[]=[];

   if (rowsQueryMaster.length > 0) {
     rowsQueryMaster.forEach((dato:any)=>{
       let resultado = typeTicketVector.find(elemento => elemento === dato[13]);
       if(resultado==undefined){
         typeTicketVector.push(dato[13]);
       }
     });
   }
   currentRow++;

   for (let i = 0; i < typeTicketVector.length; i++) {
     let typeTicket: string = typeTicketVector[i].toString(); // Convierte a tipo string

     let rowsQueryMasterTypeTicket = this.getQueryMasterTypeTicket(datos.queryMaster, typeTicket);

     if (rowsQueryMasterTypeTicket.length > 0) {
       sheet.getCell('A' + currentRow).value = typeTicket;
       sheet.getCell('A' + currentRow).font = { size: 12, bold: true };

       currentRow++;
       sheet.addTable({
         name: 'tabla4' + currentRow ,
         ref: 'A' + currentRow,
         headerRow: true,
         totalsRow: false,
         style: {
           theme: 'TableStyleLight9',
           showRowStripes: true,
         },
         columns: [
           { name: 'NRO.', filterButton: true },
           { name: 'CÓDIGO', filterButton: true },
           { name: 'TÍTULO', filterButton: true },
           { name: 'CATEGORÍA', filterButton: true },
           { name: 'SUBCATEGORÍA', filterButton: true },
           { name: 'ESTADO', filterButton: true },
           { name: 'FECHA CREACIÓN', filterButton: true },
           { name: 'FECHA CIERRE', filterButton: true },
           { name: 'TIPO TICKET', filterButton: true },
           { name: 'SOLICITANTE', filterButton: true },
           { name: 'TÉCNICO', filterButton: true },
           { name: 'HORAS', filterButton: true },
           { name: 'OBSERVACIÓN', filterButton: true }
         ],
         rows: rowsQueryMasterTypeTicket,
       });



       for (let j = currentRow; j < currentRow + rowsQueryMasterTypeTicket.length +1; j++) {
        sheet.getRow(j).getCell(7).alignment = { horizontal: 'right' };
        sheet.getRow(j).getCell(8).alignment = { horizontal: 'right' };
        sheet.getRow(j).getCell(12).alignment = { horizontal: 'right' };
        sheet.getRow(j).getCell(13).alignment = { horizontal: 'right' };
      }

       sheet.getRow(currentRow).eachCell((cell: any) => {
        cell.alignment = { horizontal: 'center' };
        });

       currentRow += rowsQueryMasterTypeTicket.length + 2;
     }
   }



//CONTENIDO PARA LA HOJA-2
 if (rowsQueryMasterDetail.length > 0) {
  sheet2.addTable({
    name: 'tablaGeneral',
    ref: 'A7',
    headerRow: true,
    totalsRow: false,
    style: {
      theme: 'TableStyleLight9',
      showRowStripes: true,
    },
    columns: [
      { name: 'NRO.', filterButton: true  },
      { name: 'CÓDIGO', filterButton: true },
      { name: 'TÍTULO', filterButton: true },
      { name: 'CATEGORÍA', filterButton: true },
      { name: 'SUBCATEGORÍA', filterButton: true },
      { name: 'ESTADO', filterButton: true },
      { name: 'FECHA CREACIÓN', filterButton: true },
      { name: 'FECHA CIERRE', filterButton: true },
      { name: 'TIPO TICKET', filterButton: true },
      { name: 'SOLICITANTE', filterButton: true },
      { name: 'TÉCNICO', filterButton: true },
      { name: 'HORAS', filterButton: true },
      { name: 'OBSERVACIÓN', filterButton: true }
    ],
    rows: rowsQueryMasterDetail,

  });

  for (let i = 7; i <= rowsQueryMasterDetail.length + 7; i++) {
    sheet2.getCell(i, 7).alignment = { horizontal: 'right' };
    sheet2.getCell(i, 8).alignment = { horizontal: 'right' };
    sheet2.getCell(i, 12).alignment = { horizontal: 'right' };
    sheet2.getCell(i, 13).alignment = { horizontal: 'right' };
  }
  sheet2.getRow(7).eachCell((cell: any) => {
  cell.alignment = { horizontal: 'center' };
});
currentRow += rowsQueryMasterDetail.length + 2;
}

    //FORMAT
    //ancho de las columnas
    workbook.eachSheet((sheet: ExcelJS.Worksheet) => {
      sheet.columns.forEach((column: any) => {
        column.width = 30;
      });
    });

    //Save
    const buffer = await workbook.xlsx.writeBuffer();
    this.descargarArchivo(buffer, 'reporte_tickets.xlsx');
  }

  descargarArchivo(buffer: ArrayBuffer, fileName: string) {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }


  getRowsListInformationSystem1(data: QueryMaster[]) {
    let rows: any[] = [];
    if (data) {
      data.forEach((info: any) => {
        let row = [];
        for (let atributo in info) {
          row.push(info[atributo]);
        }
        rows.push(row);
      });
    }
    return rows;
  }

  getQueryMasterConsolidatedReport(data: QueryMaster[]) {
    let categoryCount: { [key: string]: number } = {};
    let totalTickets = 0;
    let totalHours: { [key: string]: number } = {};
    let rows: any[] = [];

    if (data) {
      data.forEach((info: QueryMaster) => {
        totalTickets += 1;

        if (categoryCount.hasOwnProperty(info.category)) {
          categoryCount[info.category] += 1;
        } else {
          categoryCount[info.category] = 1;
        }

        if (totalHours.hasOwnProperty(info.category)) {
          totalHours[info.category] += info.hours;
        } else {
          totalHours[info.category] = info.hours;
        }
      });

      //tiempo promedio en horas
      Object.keys(categoryCount).forEach((category) => {
        const count = categoryCount[category];
        const totalHoursForCategory = totalHours[category] || 0;
        const averageHours = count > 0 ? totalHoursForCategory / count : 0;
        const roundedAverageHours = averageHours.toFixed(2);

        const percentage = (count / totalTickets) * 100;

        let row = [category, count, percentage.toFixed(2) + ' %', roundedAverageHours];
        rows.push(row);
      });
    }
    return rows;
  }


  getQueryMasterTotalConsolidatedeReport(data: QueryMaster[]) {
    let rows: any[] = [];
    let headersColumns: {name: string, filterButton: boolean}[] = [];
    if (data) {

      let headers: string[] = [];
      data.forEach((info: QueryMaster) => {
        if ( !headers.includes(info.status) ) {
          headers.push(info.status)
          let a: number = data.reduce( (acum, dataInfo) => {
            if ( dataInfo.status == info.status ) {
              return acum + 1;
            } else {
              return acum;
            }
          }, 0)
          rows.push(a);
        }
      });
      headers.forEach( name => {
        headersColumns.push({name, filterButton: true})
      });
    }
    let result = {
      headers: headersColumns,
      rows: [rows]
    }
   return result;
  }


  getQueryMaster(data: QueryMaster[]) {
    let rows: any[] = [];
    if (data) {
      data.forEach((info: QueryMaster) => {
        let row = [];
        row.push(info.category);
        row.push(info.closeAt);
        row.push(info.code);
        row.push(info.createdAt);
        row.push(info.createdBy);
        row.push(info.hours);
        row.push(info.lifeTime);
        row.push(info.observation);
        row.push(info.status);
        row.push(info.subCategory);
        row.push(info.technical);
        row.push(info.title);
        row.push(info.total);
        row.push(info.typeTicket);
        rows.push(row);
      });
    }
    return rows;
  }

  getQueryMasterCategory(data: QueryMaster[], discriminante: string) {
    let rows: any[] = [];
    let sequenceNumber = 0;

    if (data) {
      data.forEach((info: QueryMaster) => {
        if (info.category == discriminante) {

          function formatDate(date: Date | string | null): string {
            if (!date) {
              return '';
            }

            if (typeof date === 'string') {
              date = new Date(date);
            }

            const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
            return date.toLocaleDateString('es-ES', options);
          }


          let row = [];
          sequenceNumber++;
          row.push(sequenceNumber);
          row.push(info.code);
          row.push(info.title);
          row.push(info.category);
          row.push(info.subCategory);
          row.push(info.status);
          row.push(formatDate(info.createdAt));
          row.push(formatDate(info.closeAt));
          row.push(info.typeTicket);
          row.push(info.createdBy);
          row.push(info.technical);
          row.push(Number(info.hours).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
          row.push(info.observation);
          rows.push(row);
        }
      });
    }

    return rows;
  }


  getQueryMasterTypeTicket(data: QueryMaster[], typeTicket: string) {
    let rows: any[] = [];
    let sequenceNumber = 0;

    if (data) {
      data.forEach((info: QueryMaster) => {
        if (info.typeTicket == typeTicket) {

          function formatDate(date: Date | string | null): string {
            if (!date) {
              return '';
            }

            if (typeof date === 'string') {
              date = new Date(date);
            }

            const options: Intl.DateTimeFormatOptions = {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
            return date.toLocaleDateString('es-ES', options);
          }


          let row = [];
          sequenceNumber++;
          row.push(sequenceNumber);
          row.push(info.code);
          row.push(info.title);
          row.push(info.category);
          row.push(info.subCategory);
          row.push(info.status);
          row.push(formatDate(info.createdAt));
          row.push(formatDate(info.closeAt));
          row.push(info.typeTicket);
          row.push(info.createdBy);
          row.push(info.technical);
          row.push(Number(info.hours).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
          row.push(info.observation);
          rows.push(row);
        }
      });
    }

    return rows;
  }


  getQueryMasterDetail(data: QueryMaster[]) {
    let rows: any[] = [];
    let sequenceNumber = 0;
    if (data) {
      data.forEach((info: QueryMaster) => {

        function formatDate(date: Date | string | null): string {
          if (!date) {
            return '';
          }

          if (typeof date === 'string') {
            date = new Date(date);
          }

          const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
          return date.toLocaleDateString('es-ES', options);
        }
          let row = [];
          sequenceNumber++;
          row.push(sequenceNumber);
          row.push(info.code);
          row.push(info.title);
          row.push(info.category);
          row.push(info.subCategory);
          row.push(info.status);
          row.push(formatDate(info.createdAt));
          row.push(formatDate(info.closeAt));
          row.push(info.typeTicket);
          row.push(info.createdBy);
          row.push(info.technical);
          row.push(Number(info.hours).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
          row.push(info.observation);
          rows.push(row);
      });
    }
    return rows;
  }
}
