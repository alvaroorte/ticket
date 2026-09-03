import { FoldersParametersEnum } from "@core/enums/folder-parameters.enum";
import { IFieldForFuntion } from "@core/interfaces/modal-description";
import { TypeFieldEnum } from "@core/enums/type-fields";
import { TypeTicketEnum } from "@core/enums/ticket";
import { nameFunction } from "@core/interfaces/buttons-ticket.interface";
import { LABELS } from "@core/constants/labels";
import { DropdownCommonInterface } from "@core/interfaces/dropdow-common.interface";

export const getFieldsByTypeTicketAndNameFunction = (typeTicket: TypeTicketEnum, nameFunction: nameFunction): IFieldForFuntion[] => {
    switch (nameFunction) {
        case 'finishTicket':
            return [
                {
                    folder: FoldersParametersEnum.CAUSA_INCIDENTE,
                    label: LABELS.reasonTicket,
                    required: false,
                    formControlName: 'issue',
                    type: TypeFieldEnum.DROPDOWN
                },
                {
                    folder: FoldersParametersEnum.SISTEMA,
                    label: LABELS.system,
                    required: false,
                    formControlName: 'system',
                    type: TypeFieldEnum.DROPDOWN
                },
                {
                    folder: FoldersParametersEnum.IMPACTO,
                    label: LABELS.impact,
                    required: false,
                    formControlName: 'impact',
                    type: TypeFieldEnum.DROPDOWN
                },
                {
                    folder: FoldersParametersEnum.ACTIVIDAD,
                    label: LABELS.activity,
                    required: false,
                    formControlName: 'activity',
                    type: TypeFieldEnum.DROPDOWN
                },
                {
                    type: TypeFieldEnum.SELECTED_BUTTON,
                    required: true,
                    formControlName: 'sendEmail',
                    label: LABELS.notifyUser,
                    list: [
                        {value: true, label: LABELS.yes},
                        {value: false, label: LABELS.no}
                    ] as DropdownCommonInterface[]
                },
                {
                    type: TypeFieldEnum.FILE
                },
                {
                    label: LABELS.solution,
                    required: true,
                    formControlName: 'description',
                    type: typeTicket == TypeTicketEnum.SOLICITUD? TypeFieldEnum.TEXTAREA_EDITOR: TypeFieldEnum.TEXTAREA_SIMPLE
                },
                {
                    type: TypeFieldEnum.DESCRIPTION_TICKET
                }
            ];
        case 'scheduleTicket':
            return [
                {
                    label: LABELS.reason,
                    required: true,
                    formControlName: 'description',
                    type: TypeFieldEnum.TEXTAREA_EDITOR
                }
            ];
        case 'rejectByApprover':
            return [
                {
                    label: LABELS.reason,
                    required: true,
                    formControlName: 'description',
                    type: TypeFieldEnum.TEXTAREA_EDITOR
                }
            ];
        case 'rejectByModerator':
            return [
                {
                    label: LABELS.reason,
                    required: true,
                    formControlName: 'description',
                    type: TypeFieldEnum.TEXTAREA_EDITOR
                }
                
            ];
        case 'rejectSolution':
            return [
                {
                    label: LABELS.reason,
                    required: true,
                    formControlName: 'description',
                    type: TypeFieldEnum.TEXTAREA_SIMPLE
                }
                
            ];
        case 'acceptSolution': 
            return [
                {
                    folder: FoldersParametersEnum.CALIDAD_DE_SERVICIO,
                    label: LABELS.qualityService,
                    required: true,
                    formControlName: 'serviceQuality',
                    type: TypeFieldEnum.RATING
                },
                {
                    label: LABELS.comment,
                    required: false,
                    formControlName: 'description',
                    type: TypeFieldEnum.TEXTAREA_EDITOR
                }
            ]
        default:
            return [];
    }
}