import { Parameter } from "./Parameter";

export class Enterprise  {
    id: number | null = null;
    code: string | null = null;
    name: string | null = null;
    domain: string | null = null;
    urlLogo: string | null = null;
    status?: boolean | null = null;
    dedicationTime?: number | null = null;
    parameterDedicationTimeId: Parameter = new Parameter;
}
