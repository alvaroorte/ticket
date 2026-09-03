export interface IPageable<T>{
    content: T[],
    last:boolean,
    pageNumber: number,
    pageSize: number,
    totalElements: number,
    totalPages: number
}