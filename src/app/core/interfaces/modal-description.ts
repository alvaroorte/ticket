import { FoldersParametersEnum } from "@core/enums/folder-parameters.enum"
import { TypeFieldEnum } from "@core/enums/type-fields"
import { IParameterSelect } from "@core/models/Parameter"
import { DropdownCommonInterface } from "./dropdow-common.interface"

export interface IFieldForFuntion {
    type: TypeFieldEnum,
    folder?: FoldersParametersEnum,
    label?: string,
    required?: boolean,
    formControlName?: string,
    list?: IParameterSelect[] | DropdownCommonInterface[]
}

export interface IParametersByFunction {
    finishTicket?: IFieldForFuntion[],
    scheduleTicket?: IFieldForFuntion[],
    acceptSolution?: IFieldForFuntion[],
    rejectSolution?: IFieldForFuntion[],
    assignTicketToMe?: IFieldForFuntion[],
    startTicket?: IFieldForFuntion[],
    pauseTicket?: IFieldForFuntion[],
    approveByApprover?: IFieldForFuntion[],
    approveByModerator?: IFieldForFuntion[],
    rejectByApprover?: IFieldForFuntion[],
    rejectByModerator?: IFieldForFuntion[],
    closeTicket?: IFieldForFuntion[],
}