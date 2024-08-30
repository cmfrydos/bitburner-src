import type { Bladeburner } from "../Bladeburner";
import type { Availability, ActionIdentifier } from "../Types";
import { BladeburnerActionType, BladeburnerBlackOpName } from "@enums";
import { ActionClass, ActionParams } from "./Action";
import { operationSkillSuccessBonus, GetOpsTeamLoss, operationTeamSuccessBonus } from "./Operation";
import { Action } from "../Types";
import { addOffset } from "../../utils/helpers/addOffset";
import { currentNodeMults } from "../../BitNode/BitNodeMultipliers";
import { formatNumberNoSuffix } from "../../ui/formatNumber";
import { ActionEffect, ActionEffectLogParams } from "../Actions/ActionEffect";
import { BladeburnerConstants } from "../data/Constants";
import { getActionStatChange } from "./Contract";

const BlackOpsEffect: ActionEffect = new ActionEffect({
  staminaChange: (__: number, action: Action) => -BladeburnerConstants.BaseStaminaLoss * action.getEffDifficulty(),
  log: ({ teamChange, name, action }: ActionEffectLogParams) =>
    teamChange < 0
      ? `${name}: You lost ${formatNumberNoSuffix(-teamChange, 0)} team members during ${action.name}.`
      : "",
  statChangeTimeMultiply: true,
});

const BlackOpsSuccessEffect: ActionEffect = new ActionEffect({
  rankGain: (action: Action) => addOffset(action.rankGain * currentNodeMults.BladeburnerRank, 10),
  teamMemberGain: (action: Action, sleeveSize: number, teamSize: number) =>
    -GetOpsTeamLoss((action as BlackOperation).teamCount, sleeveSize, teamSize, 0.5, 1),
  statChange: (action: Action, expMult) => getActionStatChange(action, expMult),
  furtherEffect: (bladeburner, __: any, ___: any) => bladeburner.numBlackOpsComplete++,
  log: (params: ActionEffectLogParams) =>
    `${params.name}: ${params.action.name} successful! Gained ${params.rankChange} rank.`,
});

const BlackOpsFailureEffect: ActionEffect = new ActionEffect({
  rankGain: (action: Action) => -addOffset(action.rankLoss, 10),
  teamMemberGain: (action: Action, sleeveSize: number, teamSize: number) =>
    -GetOpsTeamLoss((action as BlackOperation).teamCount, sleeveSize, teamSize, 1, 1),
  statChange: (action: Action, expMult) => getActionStatChange(action, expMult * 0.5),
  hpChange: (action: Action) => {
    const damage = action.hpLoss * action.getEffDifficulty();
    return -Math.ceil(addOffset(damage, 10));
  },
  log: (params: ActionEffectLogParams) =>
    `${params.name}: ${params.action.name} failed! Lost ${-params.rankChange} rank. Took ${-params.hpChange} damage.`,
});

interface BlackOpParams {
  name: BladeburnerBlackOpName;
  reqdRank: number;
  n: number;
}

export class BlackOperation extends ActionClass {
  type: BladeburnerActionType.BlackOp = BladeburnerActionType.BlackOp;
  name: BladeburnerBlackOpName;
  n: number;
  reqdRank: number;
  teamCount = 0;
  get id(): ActionIdentifier {
    return { type: this.type, name: this.name };
  }

  constructor(params: ActionParams & BlackOpParams) {
    super(params);
    this.name = params.name;
    this.reqdRank = params.reqdRank;
    this.n = params.n;
    this.generalEffect = BlackOpsEffect;
    this.successEffect = BlackOpsSuccessEffect;
    this.failureEffect = BlackOpsFailureEffect;
    this.combinedSuccessEffect = ActionEffect.AddEffects(this.generalEffect, this.successEffect);
    this.combinedFailureEffect = ActionEffect.AddEffects(this.generalEffect, this.failureEffect);
  }

  getAvailability(bladeburner: Bladeburner): Availability {
    if (bladeburner.numBlackOpsComplete < this.n) return { error: "Have not completed the previous Black Operation" };
    if (bladeburner.numBlackOpsComplete > this.n) return { error: "Already completed" };
    if (bladeburner.rank < this.reqdRank) return { error: "Insufficient rank" };
    return { available: true };
  }

  getActionTimePenalty(): number {
    return 1.5;
  }

  getPopulationSuccessFactor(): number {
    return 1;
  }

  getChaosSuccessFactor(): number {
    return 1;
  }

  getTeamSuccessBonus = operationTeamSuccessBonus;

  getActionTypeSkillSuccessBonus = operationSkillSuccessBonus;
}
