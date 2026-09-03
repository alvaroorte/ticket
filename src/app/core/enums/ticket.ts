export enum TypeTicketEnum {
    INCIDENTE = 'INCIDENTE',
    SOLICITUD = 'SOLICITUD'
}

export enum openModalEnum {
    TIMELINE,
    MESSAGE,
    INFOTICKET,
    PRIORITY,
    APPROVERMODERATOR,
}

export enum STATES_TICKET_ENUM {
    REQUESTED = "Solicitado",
    APPROVER_WAITING = "Espera Aprobador",
    APPROVER_APPROVED = "Vobo Aprobador",
    MODERATOR_WAITING = "Espera Moderador",
    MODERATOR_APPROVED = "Vobo Moderador",
    REJECTED = "Rechazado",
    TECH_PENDING = "Técnico Pendiente",
    TECH_ASSIGNED = "Técnico Asignado",
    TECH_REASSIGNMENT = "Reasignación Técnico",
    STARTED = "Iniciado",
    PAUSED = "Pausa",
    SOLVED = "Solucionado",
    USER_VALIDATION = "Validación usuario",
    SOLUTION_REJECTED = "Rechazo solución",
    SOLUTION_ACCEPTED = "Aceptación solución",
    SCHEDULED = "CRONOGRAMADO",
    ASSOCIATES_WAITING = "Espera asociados",
    CLOSED = "Cierre",
    RECATEGORIZATION = "Recategorización",
    START_TIME_WARNING = "sendStartTimeWarning"
}