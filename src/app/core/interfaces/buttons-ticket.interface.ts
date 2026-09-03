export interface buttonBase {
    color: string,
    tooltip: string,
    icon: string,
    function: nameFunction,
}

export interface buttonsTicket {
    acceptSolution: buttonBase
    rejectSolution: buttonBase
    assignTicketToMe: buttonBase
    startTicket: buttonBase
    pauseTicket: buttonBase
    finishTicket: buttonBase
    scheduleTicket: buttonBase
    approveByApprover: buttonBase
    approveByModerator: buttonBase
    rejectByApprover: buttonBase
    rejectByModerator: buttonBase
    closeTicket: buttonBase
}

export type nameFunction = keyof buttonsTicket