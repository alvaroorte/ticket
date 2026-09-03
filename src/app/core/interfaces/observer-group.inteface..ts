import { Base } from "@core/models/base";
import { Observer } from "@core/models/Ticket";

export interface ObserverGroup extends Base {
  id: number,
  name: string,
  enterpriseId: number,
  enterpriseName: string,
  active: boolean,
  observers: Observer[],
  observersString: string,
}

export interface ObserverGroupSend {
    name: string,
    credentialId: number[],
    enterpriseId: number,
    active: boolean
}