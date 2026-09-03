import { Base } from "./base.interface";

export interface ICostCenter extends Base {
  id: number;
  code: number;
  name: string ;
  enterpriseId: number;
}

export interface IUploadExcelCostCenter {
  enterpriseId: number;
  base64File: string ;
}