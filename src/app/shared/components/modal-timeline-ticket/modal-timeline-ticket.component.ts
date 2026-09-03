import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { TicketService } from '@ticket-historical/services/tickets.service';
import { PrimeModules } from '@shared/prime-components/prime-components.module';
import { PipesModule } from '@core/pipes/pipes.module';
import { Timeline } from '@core/models/Timeline';
import { TimelineTicketComponent } from '../timeline-ticket/timeline-ticket.component';
import { FollowService } from '@core/services/follow.service';
import { LABELS } from '@core/constants/labels';
import * as ExcelJS from 'exceljs';
import { FORMAT_DATE_TIME } from '@core/constants/format-date-time';
import { ExcelService } from '@core/services/excel.service';
import { FileService } from '@core/services/file-service.service';

@Component({
    selector: 'app-modal-timeline-ticket',
    imports: [PrimeModules, PipesModule, TimelineTicketComponent],
    templateUrl: './modal-timeline-ticket.component.html',
    styleUrls: ['./modal-timeline-ticket.component.scss']
})
export class ModalTimelineTicketComponent {
    
    private ticketService = inject(TicketService);
    private followService = inject(FollowService);
    private excelService = inject(ExcelService);
    private fileService = inject(FileService);
    private datePipe = inject(DatePipe);
    
    public readonly labels = LABELS;
    public ticketTitle: string = 'Línea de tiempo';
    public ticketId: number;
    private subscription!: Subscription;
    public modalTimelineVisible: boolean = false;
    public timelineList = signal<Timeline[]>([]);

    ngOnInit(): void {
        this.subscription = this.ticketService.eventOpenTimeline.subscribe((data) => {
            this.ticketId = data.ticketId;
            this.ticketTitle = data.ticketTitle
            this.openModalTimeline();
        });
    }

    ngOnDestroy(): void {
        (this.subscription)? this.subscription.unsubscribe(): '';
    }

    private openModalTimeline() {
        this.openTimelineSidebar();
    }

    public openTimelineSidebar () {
        if (this.ticketId > 0) {
            this.followService.getTimelineByTicketId(this.ticketId).subscribe({
                next: (res) => {
                    this.timelineList.set(res);
                    this.modalTimelineVisible = true;
                }
            });
        }
    }

    public hideModal() {
        this.modalTimelineVisible = false;
    }

    public async buildExcel() {
        const rows = this.timelineList().map( row => {
            return [
                this.datePipe.transform(row.createdAt, FORMAT_DATE_TIME ),
                row.userName,
                row.comment
            ]
        });
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Línea de tiempo');
        sheet.addTable({
            name: 'tabla1',
            ref: 'A1',
            headerRow: true,
            totalsRow: false,
            style: {
                theme: 'TableStyleLight9',
                showRowStripes: true,
            },
            columns: [
            { name: 'FECHA Y HORA'},
            { name: 'USUARIO'},
            { name: 'DESCRIPCION'}
            ],
            rows
        });

        workbook.eachSheet((sheet: ExcelJS.Worksheet) => {
            sheet.columns.forEach((column: Partial<ExcelJS.Column>) => {
                column.width = 28;
            });
        });

        const file: File = await this.excelService.convertExcelToFile(workbook, 'Línea de tiempo');
        this.fileService.downloadFile(file, 'Linea de tiempo');
    }
}
