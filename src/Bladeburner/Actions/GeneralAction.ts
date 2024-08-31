import type { Person } from "../../PersonObjects/Person";
import type { Bladeburner } from "../Bladeburner";
import type { ActionIdentifier } from "../Types";

import { BladeburnerActionType, BladeburnerGeneralActionName } from "@enums";
import { ActionClass, ActionParams } from "./Action";
import { clampNumber } from "../../utils/helpers/clampNumber";

type GeneralActionParams = ActionParams & {
  name: BladeburnerGeneralActionName;
  getActionTime: (bladeburner: Bladeburner, person: Person) => number;
  getSuccessChance?: (bladeburner: Bladeburner, person: Person) => number;
};

export class GeneralAction extends ActionClass {
  type: BladeburnerActionType.General = BladeburnerActionType.General;
  name: BladeburnerGeneralActionName;
  get id(): ActionIdentifier {
    return { type: this.type, name: this.name };
  }

  constructor(params: GeneralActionParams) {
    super(params);
    this.name = params.name;
    this.getActionTotalSeconds = params.getActionTime;
    if (params.getSuccessChance) this.getSuccessChance = params.getSuccessChance;
  }

  getSuccessChance(__bladeburner: Bladeburner, __person: Person): number {
    return 1;
  }

  getSuccessRange(bladeburner: Bladeburner, person: Person): [minChance: number, maxChance: number] {
    const chance = clampNumber(this.getSuccessChance(bladeburner, person), 0, 1);
    return [chance, chance];
  }
}
