import { FoldersParametersEnum } from "@core/enums/folder-parameters.enum";
import { Base } from "./base";

export class Parameter extends Base  {
    id: number;
    folder: string;
    ranking: number;
    value: string;
    icon: string;
    color: string;
    magnitude: string;
    kind: string;
    title: string;
    description: string;
    status?: boolean;
}

export interface IParameterSelect  {
    id: number;
    folder: FoldersParametersEnum;
    ranking: number;
    value: string;
    color: string;
}

export interface IFolder  {
    name: string;
    editable: boolean;
}
