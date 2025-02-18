import { MessageService } from 'primeng/api';
import { Injectable } from '@angular/core';
import { DataCommon } from '@core/models/FieldsCommons';
import { environment } from '@core/environments/environment.development';

@Injectable({
    providedIn: 'root',
})
export class HelpersService {

    constructor(private messageService: MessageService) {}

    messageNotification(severity: string, title: string,  detail: string, life?: number) {
        severity = severity;
        title = title;
        detail = detail;
        life = life? life: 3000;
        return (this.messageService.add({ severity: severity, summary: title, detail: detail, life: life }));
    }

    getArraysByTicketFunction( array: DataCommon[] ) {
        let result: any = {};
        array.forEach( ( data ) => {
            ( result[data.code!.replace(/\s/g, '')] )? result[data.code!.replace(/\s/g, '')].push(data):
                result[data.code!.replace(/\s/g, '')] = [data];
        })
        return result;
    }

    async filterOfArrayByFields( wordKey: string, arrayBase: any[], fields: string[] ) {
        let result: any = [];
        for ( let row of arrayBase) {
            for (let field of fields) {
                if ( row[field].toLowerCase().indexOf( wordKey.toLowerCase() ) > -1 ) {
                    result.push(row)
                    break;
                }
            }
        }
        return result;
    }
}
