export interface ColumnI{
    header:string,
    name:string
    showMobile?:boolean,
    class?:string,
    filter?:any,
    pipe?: string,
    show?: boolean
}
  
export interface ActionI {
    name:string
    class:string
    icon:string
}