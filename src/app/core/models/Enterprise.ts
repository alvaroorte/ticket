import { Base } from "./base";

export class Enterprise extends Base  {
    id: number;
    code: string;
    name: string;
    domain: string;
    logo: string;
    hasCostCenter: boolean;
}
