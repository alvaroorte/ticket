import { buttonsTicket } from "@core/interfaces/buttons-ticket.interface";

export const buttonsOfTickets: buttonsTicket = {
    approveByApprover: {
        color: 'success',
        icon: 'pi-thumbs-up-fill',
        tooltip: 'Aprobar ticket',
        function: 'approveByApprover'
    },
    rejectByApprover: {
        color: 'danger',
        icon: 'pi-thumbs-down-fill',
        tooltip: 'Rechazar ticket',
        function: 'rejectByApprover'
    },
    approveByModerator: {
        color: 'success',
        icon: 'pi-thumbs-up-fill',
        tooltip: 'Aprobar ticket',
        function: 'approveByModerator'
    },
    rejectByModerator: {
        color: 'danger',
        icon: 'pi-thumbs-down-fill',
        tooltip: 'Rechazar ticket',
        function: 'rejectByModerator'
    },
    assignTicketToMe: {
        color: 'primary',
        icon: 'pi-check-square',
        tooltip: 'Asignarme ticket',
        function: 'assignTicketToMe'
    },
    startTicket: {
        color: 'primary',
        icon: 'pi-play',
        tooltip: 'Iniciar ticket',
        function: 'startTicket'
    },
    pauseTicket: {
        color: 'warn',
        icon: 'pi-pause',
        tooltip: 'Pausar ticket',
        function: 'pauseTicket'
    },
    finishTicket: {
        color: 'danger',
        icon: 'pi-stop',
        tooltip: 'Finalizar ticket',
        function: 'finishTicket'
    },
    scheduleTicket: {
        color: 'info',
        icon: 'pi-clock',
        tooltip: 'Cronogramar ticket',
        function: 'scheduleTicket'
    },
    acceptSolution: {
        color: 'success',
        icon: 'pi-thumbs-up-fill',
        tooltip: 'Aceptar solución',
        function: 'acceptSolution'
    },
    rejectSolution: {
        color: 'danger',
        icon: 'pi-thumbs-down-fill',
        tooltip: 'Rechazar solución',
        function: 'rejectSolution'
    },
    closeTicket: {
        color: 'contrast',
        icon: 'pi-times',
        tooltip: 'Cerrar ticket',
        function: 'closeTicket'
    }
}