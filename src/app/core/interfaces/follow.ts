export interface IMessages  {
    comment: string
    userName: string
    createdAt: string
    fileName: string
    isUserGenerated: boolean
}

export interface ICreateMessages {
    comment: string
    ticketId: number
    attachmentId: number
}